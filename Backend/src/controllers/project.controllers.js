import { User } from '../models/user.models.js'
import { Project } from '../models/project.models.js'
import { projectMember } from '../models/projectmember.models.js'
import { ApiResponse } from '../utils/api-response.js'
import { ApiError } from '../utils/api-error.js'
import { asyncHandler } from '../utils/async-handler.js'
import mongoose from 'mongoose'
import { AvailableUserRole , UserRolesEnum} from '../utils/constants.js'


// const getProjects = asyncHandler(async (req, res) => {
//     const projects = await projectMember.aggregate(
//         [
//             {
//                 $match: {
//                     user: new mongoose.Types.ObjectId(req.user._id),
//                 },
//             },
//             {
//                 $lookup: {
//                     from: "projects",
//                     localField: "project",
//                     foreignField: "_id",
//                     as: "projects",
//                     pipeline: [
//                         {
//                             $lookup: {
//                                 from: "projectmembers",
//                                 localField: "_id",
//                                 foreignField: "project",
//                                 as: "projectmembers"
//                             }
//                         }, {
//                             $addFields: {
//                                 members: {
//                                     $size: "$projectmembers"
//                                 }
//                             }
//                         }
//                     ]

//                 }
//             },
//             {
//                 $unwind: "$projects"
//             }, {
//                 $project: {
//                     project: {
//                         _id: 1,
//                         name: 1,
//                         description: 1,
//                         members: 1,
//                         createdAt: 1,
//                         createdBy: 1,

//                     },
//                     role: 1,
//                     _id: 0
//                 }
//             }
//         ]
//     )
//     return res.status(200)
//         .json(new ApiResponse(200, projects, "Projects fetched successfuly"))
// })

const getProjects = asyncHandler(async (req, res) => {
  const projects = await projectMember.aggregate([
    // Stage 1: Get memberships of the logged-in user
    {
      $match: {
        user: new mongoose.Types.ObjectId(req.user._id),
      },
    },

    // Stage 2: Fetch the corresponding project documents
    {
      $lookup: {
        from: "projects",
        localField: "project",
        foreignField: "_id",
        as: "projects",

        pipeline: [
          // Stage 3: Fetch all membership records of each project
          {
            $lookup: {
              from: "projectmembers",
              localField: "_id",
              foreignField: "project",
              as: "projectmembers",
            },
          },

          // Stage 4: Calculate total number of members
          {
            $addFields: {
              members: {
                $size: "$projectmembers",
              },
            },
          },
        ],
      },
    },

    // Stage 5: Convert the projects array into individual documents
    {
      $unwind: "$projects",
    },
    {
  $sort: {
    "projects.createdAt": -1
  }
},
    

    // Stage 6: Shape the final response
    {
      $project: {
        _id: 0,
        project: "$projects",
        role: 1,
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(
      200,
      projects,
      "Projects fetched successfully"
    )
  );
});


const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findById(projectId).populate(
        "createdBy",
        "fullName username avatar"
    );
    if (!project) {
        throw new ApiError(404, "Project not found")
    }
        res.status(200)
            .json(
                new ApiResponse(200, {project, role: req.user.role},"Project fetched successfully")
            )
})

const createProject = asyncHandler(async (req, res) => {
    const { name, description , deadline} = req.body
    const project = await Project.create({
        name,
        description,
        deadline: deadline || null,
        createdBy: new mongoose.Types.ObjectId(req.user._id),
    })
    const membership = await projectMember.create(
        {
            user: new mongoose.Types.ObjectId(req.user._id),
            project: new mongoose.Types.ObjectId(project._id),
            role: UserRolesEnum.ADMIN
        }
    )

    return res
        .status(201)
        .json(
            new ApiResponse(201, {project, role:membership.role},"Project Created successfully")
        )
})

const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { projectId } = req.params

    const project = await Project.findByIdAndUpdate(projectId,
        {
            name,
            description
        }, {
        new: true
    }
    )
    if (!project) {
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
const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const project = await Project.findByIdAndDelete(projectId)
    if (!project) {
        throw new ApiError(404, "Project not found");
    }
    return res
        .status(200)
        .json(new ApiResponse(200, project, "project deleted successfully"))
})
const addMembersToProject = asyncHandler(async (req, res) => {
    const { email, role } = req.body
    const { projectId } = req.params
    const user = await User.findOne({ email })
    if (!user) {
        throw new ApiError(404, "User does not exist")
    }
    await projectMember.findOneAndUpdate({
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId)
    }, 
    {
        user: new mongoose.Types.ObjectId(user._id),
        project: new mongoose.Types.ObjectId(projectId),
        role: role
    },{
        new : true,
        upsert:true
    })
    return res.status(200).json(new ApiResponse(201, {}, "Project Member added succesfully"))
})
const getProjectMembers = asyncHandler(async (req, res) => {
    const {projectId} = req.params
    const project = await Project.findById(projectId)

    if(!project){
        throw new ApiError(404, "Project not found");
    }

    const projectMembers = await projectMember.aggregate([
        {
            $match : {
                project : new mongoose.Types.ObjectId(projectId) 
            }
        },
        {
            $lookup:{
                from : "users",
                localField: "user",
                foreignField:"_id",
                as : "user",
                pipeline : [
                    {
                        $project : {
                            _id : 1,
                            fullName : 1,
                            avatar : 1,

                        }
                    }
                ]
            }
        },
       {
         $addFields : {
            user: {
                $arrayElemAt : ["$user", 0]
            }
        }
    },
    {
        $project : {
            project : 1,
            user : 1,
            role: 1,
            createdAt : 1,
            updatedAt : 1,
            _id : 0
        }
    }
])
   return res.status(200)
   .json(
    new ApiResponse(200, projectMembers, "Project members fetched successfully")
   )
})
const updateMemberRole = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params
    const {newRole} = req.body

    if(!AvailableUserRole.includes(newRole)){
        throw new ApiError(400, "Invalid Role")
    }

    let ProjectMember = await projectMember.findOne({
        project : new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    })
     if(!ProjectMember){
        throw new ApiError(400, "Invalid Member")
    }
    ProjectMember = await projectMember.findByIdAndUpdate(
        ProjectMember._id,
        {
            role : newRole
        },
        {
            new : true
        }
    )
      if(!ProjectMember){
        throw new ApiError(400, "Project Member not found")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(200, ProjectMember, "Project member role updated successfully")
    )
})
const deleteMember = asyncHandler(async (req, res) => {
    const {projectId, userId} = req.params;
    let ProjectMember = await projectMember.findOne({
        project : new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    })
     if(!ProjectMember){
        throw new ApiError(400, "Invalid Member")
    }
    ProjectMember = await projectMember.findByIdAndDelete(
        ProjectMember._id
    )
     if(!ProjectMember){
        throw new ApiError(400, "Invalid Member")
    }
     return res
    .status(200)
    .json(
        new ApiResponse(200, ProjectMember, "Project member role deleted successfully")
    )
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