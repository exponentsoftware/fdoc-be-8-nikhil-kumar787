import asyncHandler from "express-async-handler";
import Like from "../model/likeModel";
import Rating from "../model/ratingModel";
import View from "../model/viewModel";
import Comment from "../model/commentModel";
import ErrorHandler from "../utils/errorHandler";
import Tag from "../model/tagModel";

const addLikes = asyncHandler(async (req, res, next) => {
  const { userId, todoId } = req.body;

  const todo_like = await Like.findOne({ todoId: todoId });
  if (!todo_like) {
    const like = new Like({
      userId,
      todoId,
    });
    const liked = await like.save();

    if (liked) {
      return res.status(201).json({
        message: "like added successfully",
      });
    } else {
      return next(new ErrorHandler("Something went wrong", 400));
    }
  } else {
    const like = await Like.findOne({ userId: userId });

    if (!like) {
      const existingTodoliked = await Like.findOneAndUpdate(
        { todoId: todo_like.todoId },
        { $push: { userId: userId } }
      );
      console.log(existingTodoliked);
    } else {
      return res.status(201).json({
        message: "already liked by the user",
      });
    }
  }
});

const addRating = asyncHandler(async (req, res, next) => {
  const { userId, todoId, rate } = req.body;

  const todo_rating = await Rating.findOne({ todoId: todoId });
  if (!todo_rating) {
    const rating = new Rating({
      userId,
      todoId,
      rating: rate,
    });
    const rated = await rating.save();

    if (rated) {
      return res.status(201).json({
        message: "Rating added successfully",
      });
    } else {
      return next(new ErrorHandler("Something went wrong", 400));
    }
  } else {
    const rating = await Rating.findOne({ userId: userId });

    if (!rating) {
      const existingRating = await Rating.findOneAndUpdate(
        { todoId: todo_rating.todoId },
        { $push: { userId: userId }, $inc: { rating: rate } },
        { new: true, upsert: true, useFindAndModify: false }
      );
      console.log(existingRating);
    } else {
      return res.status(201).json({
        message: "already Rated_by by the user",
      });
    }
  }
});

const addViews = asyncHandler(async (req, res, next) => {
  const { userId, todoId } = req.body;

  const todo_view = await View.findOne({ todoId: todoId });

  if (!todo_view) {
    const view = new View({
      userId,
      todoId,
    });
    const viewed = await view.save();

    if (viewed) {
      return res.status(201).json({
        message: "viewed_by added successfully",
      });
    } else {
      return next(new ErrorHandler("Something went wrong", 400));
    }
  } else {
    const view = await View.findOne({ userId: userId });

    if (!view) {
      const existingViewed = await Like.findOneAndUpdate(
        { todoId: todo_view.todoId },
        { $push: { userId: userId } }
      );
      return res.status(201).json({
        message: "View added successfully",
      });
    } else {
      return res.status(201).json({
        message: "already viewed by the user",
      });
    }
  }
});

const getComment = asyncHandler(async (req, res, next) => {
  const comments = await Comment.find({ todoId: req.params.id });

  if (!comments) {
    return next(new ErrorHandler("Comment not found with this todo id", 404));
  }

  res.status(200).json({
    success: true,
    comments,
  });
});

const addComment = asyncHandler(async (req, res, next) => {
  const { comment, userId, todoId } = req.body;

  if (!comment || !userId || !todoId) {
    return next(new ErrorHandler("Please enter the appropriate fields", 400));
  } else {
    const comments = new Comment({ comment, userId, todoId });

    const createdComment = await comments.save();

    res.status(201).json(createdComment);
  }
});

const updateComment = asyncHandler(async (req, res, next) => {
  let comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorHandler("Comment not found with this id", 404));
  }

  comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    comment,
  });
});

const deleteComment = asyncHandler(async (req, res, next) => {
  const comment = await Comment.findById(req.params.id);

  if (!comment) {
    return next(new ErrorHandler("Comment not found with this id", 404));
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    message: "Comment is deleted",
  });
});

const updateUserComment = asyncHandler(async (req, res, next) => {
  const { comment, userId, commentId } = req.body;
  let existingComment = await Comment.findOne({
    userId: userId,
    _id: commentId,
  });

  if (!existingComment) {
    return next(new ErrorHandler("Access Denied", 400));
  }

  existingComment = await Comment.findOneAndUpdate(
    { _id: commentId },
    { $set: { comment: comment } },
    { new: true, upsert: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
    existingComment,
  });
});

const deleteUserComment = asyncHandler(async (req, res, next) => {
  const { userId } = req.body;
  let existingComment = await Comment.findOne({
    userId: userId,
    _id: req.params.id,
  });

  if (!existingComment) {
    return next(new ErrorHandler("Access Denied", 400));
  }

  await existingComment.remove();

  res.status(200).json({
    success: true,
    message: "Comment is deleted",
  });
});

const addTag = asyncHandler(async (req, res, next) => {
  const { title, category, todoId } = req.body;

  if (!title || !category || !todoId) {
    return next(new ErrorHandler("Please enter the appropriate fields", 400));
  } else {
    const tag = new Tag({ title, category, todoId });

    const createdTag = await tag.save();

    res.status(201).json(createdTag);
  }
});

const updateTag = asyncHandler(async (req, res, next) => {
  let tag = await Tag.findById(req.params.id);

  if (!tag) {
    return next(new ErrorHandler("Tag not found with this id", 404));
  }

  tag = await Tag.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidator: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    tag,
  });
});

const deleteTag = asyncHandler(async (req, res, next) => {
  const tag = await Tag.findById(req.params.id);

  if (!tag) {
    return next(new ErrorHandler("Tag not found with this id", 404));
  }

  await tag.remove();

  res.status(200).json({
    success: true,
    message: "Tag is deleted",
  });
});

const updateUserTag = asyncHandler(async (req, res, next) => {
  const { title, category, todoId, tagId } = req.body;
  let existingTag = await Tag.findOne({
    _id: tagId,
    todoId: todoId,
  });

  if (!existingTag) {
    return next(new ErrorHandler("Access Denied", 400));
  }

  existingTag = await Tag.findOneAndUpdate(
    { _id: tagId },
    { $set: { title: title, category: category } },
    { new: true, upsert: true, useFindAndModify: false }
  );

  res.status(200).json({
    success: true,
    existingTag,
  });
});

export {
  addLikes,
  addRating,
  addViews,
  getComment,
  addComment,
  updateComment,
  deleteComment,
  updateUserComment,
  deleteUserComment,
  addTag,
  updateTag,
  deleteTag,
  updateUserTag,
};
