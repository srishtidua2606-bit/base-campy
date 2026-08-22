import {User} from '../models/user.models.js'
import {Project} from '../models/project.models.js'
import {projectMember} from '../models/projectmember.models.js'
import {ApiResponse} from '../utils/api-response.js'
import {ApiError} from '../utils/api-error.js'
import {asyncHandler} from '../utils/async-handler.js'
import mongoose from 'mongoose'


const getProjects = asyncHandler(async(req, res) => {
    const projects = await projectMember.aggregate(
        [
            {
                $match : {
                    user : new mongoose.Types.ObjectId(req.user._id),
                },
            },
            {
                $lookup:{
                    from : "projects",
                    localField : "project",
                    foreignField: "_id",
                    as : "projects",
                    pipeline : [
                        {
                            $lookup : {
                                from: "projectmembers",
                                localField:"_id",
                                foreignField:"projects",
                                as:"projectmembers"
                            }
                        }
                    ]

                }
            }
        ]
    )
})
const getProjectById = asyncHandler(async(req, res) => {
    //test
})
const createProject = asyncHandler(async(req, res) => {
    const {name , description} = req.body
    const project = await Project.create({
        name,
        description,
        createdBy : new mongoose.Types.ObjectId(req.user._id),
    })
    await projectMember.create(
        {
            user: new mongoose.Types.ObjectId(req.user._id),
            project : new mongoose.Types.ObjectId(project._id),
            role : UserRolesEnum.ADMIN
        }
    )

    return res
    .status(201)
    .json(
        new ApiResponse(201, "Project Created successfully")
    )
})
const updateProject = asyncHandler(async(req, res) => {
     const {name , description} =req.body
     const {projectId} = req.params

    const project = await Project.findByIdAndUpdate( projectId,
        {
            name, 
            description
        },{
            new : true
        }
     )
     if (!project){
        throw new ApiError(404, "project not found")
     }
     return res.status(200)
     .json(
        new ApiResponse(
            200,
            project,
            "project update successfully."
        )
     )
})
const deleteProject = asyncHandler(async(req, res) => {
    const {projectId} = req.params
    const project = await Project.findByIdAndDelete(projectId)
    if(!project ){
        throw new ApiError(404, "Project not found");
    }
    return res
    .status(200)
    .json(new ApiResponse(200, project, "project deleted successfully"))
})
const addMembersToProject = asyncHandler(async(req, res) => {
    //test
})
const getProjectMembers = asyncHandler(async(req, res) => {
    //test
})
const updateMemberRole = asyncHandler(async(req, res) => {
    //test
})
const deleteMember = asyncHandler(async(req, res) => {
    //test
})

export {
    getProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    addMembersToProject,
    getProjectMembers,
    updateMemberRole,
    deleteMember
}