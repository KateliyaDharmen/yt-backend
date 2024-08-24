import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiRespone.js";

const registerUser = asyncHandler( async (req, res) => {
    //sample response to check weather the api is currently working or not
    // res.status(200).json({
    //     message: "ok"
    // })

    // get user details from frontend
    // validation - not empty
    // check if user already exist: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar 
    // create user object - create entry in db
    // remove password and refresh token feild from response
    // check for user creation
    // return response

    //----------------------------------------get user details----------------------------------------
    const {fullName, email, username, password} = req.body
    // console.log("req.body: ", req.body)

    // ----------------------------------Validation part (not empty)-----------------------------------------------
    // if(fullName === " "){
    //     throw new ApiError(400, "fullname is required")
    // }

    //we can check one by one if you want but there is a another method

    if (
        [fullName, email, username, password].some((feild) => feild?.trim() === "")
    ) {
        throw new ApiError(400, "All feilds are required");
    }

    //------------------------------------User existance checking--------------------------------------------------
    const existedUser = await User.findOne({
        $or: [{username}, {email}]
    })
    // console.log(existedUser)

    if(existedUser){
        throw new ApiError(409, "User is Exists")
    }

    //-------------------------------------getting localPath for avatar and images-------------------------------------------
    // console.log("req.files: ", req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    // const coverImageLocalPath = req.files?.coverImage[0]?.path;

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    //-------------------------------------check for avatar(required in db)------------------------------------------------
    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    //------------------------------------upload avatar and coverImage on cloudinary------------------------------------
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    // console.log("avatar: ", avatar)
    // console.log("coverImage: ", coverImage)

    //------------------------------------check for avatar is uploaded on cloudinary----------------------------------
    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }

    //------------------------------------create user object - create entry in db-------------------------------------- 
    const user = await User.create({
        fullName,   
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    // console.log(createdUser)

    if(!createdUser){
        throw new ApiError(500, "Somthing went wrong while registering the user")
    }

    //----------------------------------------sending the response------------------------------------------------
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User is Successfully Registered")
    );
    
})

export {registerUser}