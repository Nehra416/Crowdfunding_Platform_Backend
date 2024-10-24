const Fundraiser = require('../models/FundRaiserSchema');
const User = require('../models/UserSchema');

const doDonation = async (req, res) => {
    try {
        const campaignId = req.params.id;
        const { amount } = req.body;
        const userId = req.user;

        // Check if campaign exists
        const campaign = await Fundraiser.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found',
                success: false,
            });
        }

        // add userId to the campaign's whoDonated in db if user don't exist
        const userIndex = campaign.whoDonated.findIndex((whoDonated) => whoDonated.user == userId);
        if (userIndex) {
            campaign.whoDonated.push({ user: userId, amount });
            // console.log('first time')
        } else {
            // add the amount of donation to the campaign by the user
            campaign.whoDonated[userIndex].amount += parseFloat(amount);
            // console.log(campaign.whoDonated[userIndex])
        }


        // Update campaign donations
        campaign.currentAmount += parseFloat(amount);
        await campaign.save();

        // add the donation to the user's profile
        const user = await User.findById(userId);
        user.donated.push({ amount, fundraiser: campaign._id });
        await user.save();

        // Return updated campaign information
        return res.json({
            message: 'Donation successful',
            success: true,
            // campaign,
        });

    } catch (error) {
        console.log(error);
    }
}

const allUsersWhoDonate = async (req, res) => {
    try {
        const campaignId = req.params.id;

        const campaign = await Fundraiser.findById(campaignId).populate({ path: 'whoDonated.user', select: 'name email' })
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found',
                success: false,
            });
        }

        return res.status(200).json({
            message: 'get all users who donated',
            success: true,
            users: campaign.whoDonated,
        })
    } catch (error) {
        console.log(error);
    }
}

const userAllDonation = async (req, res) => {
    try {
        const userId = req.user;

        // find all donations do by the user till now
        const donations = await User.findById(userId).populate('donated').select('donated');
        if (!donations) {
            return res.status(404).json({
                message: "You can't do any donations yet",
                success: false,
            });
        }

        return res.status(200).json({
            message: 'Your all donations',
            success: true,
            donations,
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    doDonation, allUsersWhoDonate, userAllDonation
};