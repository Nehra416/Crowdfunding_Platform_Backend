const Fundraiser = require('../models/FundRaiserSchema');
const uploadToCloudinary = require('../utils/cloudinary');
const fs = require('fs');

const createCampaign = async (req, res) => {
    try {
        const { title, description, targetAmount, medical_issue, bankAccountNumber, ifcCode } = req.body;
        const { picture, documents } = req.files;
        const userId = req.user;
        console.log("picture", picture[0])
        console.log("document", documents[0])
        console.log("documentPath", documents[0]?.path)

        // all input field required
        if (!title || !description || !targetAmount || !medical_issue || !bankAccountNumber || !ifcCode) {
            return res.status(400).json({
                message: 'All fields are required',
                success: false,
            });
        }

        // check that user's campaign is already in active state
        const userCampaigns = await Fundraiser.find({ user: userId, status: 'active' });
        // console.log(userCampaigns);
        if (userCampaigns.length > 0) {
            return res.status(400).json({
                message: 'You already have an active or in progress campaign',
                success: false,
            });
        }

        // create a cloudinary url to store the picture in db
        const pictureUrl = await uploadToCloudinary(picture?.[0].path);
        console.log("pictureUrl", pictureUrl);

        // create a cloudinary urls to store the documents in db
        const documentUrls = await uploadToCloudinary(documents?.[0].path);
        console.log("documentUrls", documentUrls);

        // calling nodemailer here to send OTP ****

        // Create a new campaign
        const newCampaign = await Fundraiser.create({ title, description, targetAmount, medical_issue, bankAccountNumber, ifcCode, user: userId, picture: pictureUrl, documents: documentUrls });

        // delete the images after uploading successfully
        fs.unlink(picture?.[0].path, (err) => {
            if (err) console.error("Error in deleting images", err);
            else console.log('Image deleted successfully');
        });
        fs.unlink(documents?.[0].path, (err) => {
            if (err) console.error("Error in deleting images", err);
            else console.log('Image deleted successfully');
        });


        // return with success message and with details
        return res.status(201).json({
            message: 'Campaign created successfully',
            success: true,
            campaign: newCampaign
        });
    } catch (error) {
        console.error(error);
    }
}

const getAllCampaigns = async (req, res) => {
    try {
        // Get all active campaigns from the database
        const allCampaigns = await Fundraiser.find({ status: 'active' }).populate({ path: 'user', select: '-password' });

        // return with success message and with details of all campaign
        return res.status(200).json({
            message: 'Get all campaigns successfully',
            success: true,
            campaigns: allCampaigns
        });
    } catch (error) {
        console.log(error);
    }
}

const getCampaignById = async (req, res) => {
    try {
        const campaignId = req.params.id;

        // Get campaign by id from the database
        const campaign = await Fundraiser.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found',
                success: false,
            });
        }

        // return with success message and with details of the campaign
        return res.status(200).json({
            message: 'Get campaign by id successfully',
            success: true,
            campaign
        });
    } catch (error) {
        console.log(error);
    }
}

const updateCampaign = async (req, res) => {
    try {
        const { title, description, targetAmount, medical_issue, bankAccountNumber, ifcCode } = req.body;
        const userId = req.user;
        const campaignId = req.params.id;

        const campaign = await Fundraiser.findById(campaignId)
        if (!campaign) {
            return res.status(404).json({
                message: 'No campaign found for this user',
                success: false,
            });
        }

        console.log("userId", userId, campaign.user)

        // Only allow the user who created the campaign to update not to the others (losely check because campaign.user is a objectId)
        if (userId != campaign.user) {
            return res.status(401).json({
                message: 'Unauthorized for update this campaign',
                success: false,
            });
        }

        // Update the campaign
        if (title) campaign.title = title;
        if (description) campaign.description = description;
        if (targetAmount) campaign.targetAmount = targetAmount;
        if (medical_issue) campaign.medical_issue = medical_issue;
        if (bankAccountNumber) campaign.bankAccountNumber = bankAccountNumber;
        if (ifcCode) campaign.ifcCode = ifcCode;
        await campaign.save();

        // return with success message and with updated details
        return res.status(200).json({
            message: 'Campaign updated successfully',
            success: true,
            campaign
        });

    } catch (error) {
        console.log(error);
    }
}

const deleteCampaign = async (req, res) => {
    try {
        const campaignId = req.params.id;
        const userId = req.user;

        const campaign = await Fundraiser.findById(campaignId)
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found',
                success: false,
            })
        }

        if (campaign.user != userId) {
            return res.status(400).json({
                message: 'Unauthorized to delete this campaign',
                success: false,
            })
        }

        // Delete the campaign from the database
        await Fundraiser.findByIdAndDelete(campaignId);

        return res.status(200).json({
            message: 'Campaign deleted successfully',
            success: true,
        });

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createCampaign, getAllCampaigns, getCampaignById, updateCampaign, deleteCampaign
}