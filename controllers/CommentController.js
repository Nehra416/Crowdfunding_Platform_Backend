const Fundraiser = require("../models/FundRaiserSchema");

const addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const campaignId = req.params.id;
        const userId = req.user;

        // check all required fields
        if (!content || !campaignId || !userId) {
            return res.status(400).json({
                message: 'Something is missing',
                success: false,
            });
        }

        // find campaign by id
        const campaign = await Fundraiser.findById(campaignId);
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found',
                success: false,
            });
        }

        // add comment to campaign
        campaign.comments.push({ content, user: userId });
        await campaign.save();

        return res.status(200).json({
            message: 'Comment added successfully',
            success: true,
        })
    } catch (error) {
        console.log(error);
    }
}

const getAllComments = async (req, res) => {
    try {
        const campaignId = req.params.id;

        // find campaign by id
        const campaign = await Fundraiser.findById(campaignId).populate({ path: 'comments.user', select: 'name content' })
        if (!campaign) {
            return res.status(404).json({
                message: 'Campaign not found',
                success: false,
            });
        }

        // return all the comments of the campaign
        return res.status(200).json({
            message: 'All comments of the campaign',
            success: true,
            comments: campaign.comments,
        })
    } catch (error) {
        console.log(error);
    }
}

const deleteComment = async (req, res) => {
    try {
        const userId = req.user;
        const campaignId = req.params.id;
        const { commentId } = req.query;

        const campaign = await Fundraiser.findById(campaignId).select('comments')
        if (!campaign) {
            return res.status(404).json({
                message: 'No Campaign found',
                success: false
            })
        }


        // find the comment to be deleted
        const commentIndex = await campaign.comments.findIndex(comment => comment._id.toString() === commentId);
        if (commentIndex === -1) {
            return res.status(404).json({
                message: 'Comment not found',
                success: false
            });
        }

        // check the user who is trying to delete the comment is the owner of this comment
        if (campaign.comments[commentIndex].user != userId) {
            return res.status(401).json({
                message: 'UnAuthorized to delete this comment',
                success: false
            })
        }

        // remove the comment
        campaign.comments.splice(commentIndex, 1);
        await campaign.save();

        return res.status(200).json({
            message: 'Comment deleted successfully',
            success: true,
        })

    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    addComment, getAllComments, deleteComment
}