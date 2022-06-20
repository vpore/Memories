import PostMsg from "../models/postMsg.js";
import mongoose from "mongoose";

export const getPosts = async (req, res) => {
    try{
        const postMessages = await PostMsg.find();
        res.status(200).json(postMessages);
    }
    catch(err){
        res.status(404).json({message: err.message});
    }
}

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;

    try {
        const title = new RegExp(searchQuery, 'i');
        const posts = await PostMsg.find({$or: [ {title}, {tags: {$in: tags.split(',') }} ]});
        res.json({data: posts});
    } catch (error) {
        res.staus(404).json({message: error.message});
    }
}

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMsg({...post, creator: req.userId, createdAt: new Date().toISOString()});

    try{
        await newPost.save();
        res.status(201).json(newPost);
    }
    catch(err){
        res.status(409).json({message: err.message});
    }
}

export const updatePost = async (req, res) => {
    const {id: _id} = req.params;
    const post = req.body;
    
    if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send("No post with that id");

    const updatedPost = await PostMsg.findByIdAndUpdate(_id, {...post, _id}, {new: true});
    res.json(updatedPost);
}

export const deletePost = async(req, res) => {
    const {id} = req. params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    await PostMsg.findByIdAndRemove(id);
    res.json({message: 'Post Deleted!'});
}

export const likePost = async(req, res) => {
    const {id} = req.params;
    if(!req.userId) return res.json({message: 'Unauthenticated'});
    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");
    const post = await PostMsg.findById(id);
    const index = post.likes.findIndex((id) => id === String(req.userId));
    if(index === -1){post.likes.push(req.userId);}
    else{
        post.likes = post.likes.filter((id) => id !== String(req.userId))
    }
    const updatedPost = await PostMsg.findByIdAndUpdate(id, post, {new: true});
    res.json(updatedPost);
}