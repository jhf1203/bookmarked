// Sets a flag for whether or not we're updating a post to be false initially
let updating = false;
// blogContainer holds all of our posts
const blogContainer = $(".blog-container");
// Click events for the edit and delete buttons
$(document).on("click", "button.delete", handlePostDelete);
$(document).on("click", "button.edit", handlePostEdit);
let posts;

// Getting jQuery references to the post body & title select
const bodyInput = $("#body");
const titleInput = $("#title");
const cmsForm = $("#cms");
// Adding an event listener for when the form is submitted
$(cmsForm).on("click", function (event) {
  event.preventDefault();
  console.log(window);
  console.log(event);
  // Wont submit the post if we are missing a body or a title
  if (!titleInput.val().trim() || !bodyInput.val().trim()) {
    return;
  }
  // Constructing a newPost object to hand to the database
  const newPost = {
    heading: titleInput.val().trim(),
    blurb: bodyInput.val().trim()
  };

  console.log(newPost);

  // If we're updating a post run updatePost to update a post
  // Otherwise run submitPost to create a whole new post
  if (updating) {
    newPost.id = postId;
    updatePost(newPost);
  } else {
    submitPost(newPost);
  }
});

// Submits a new post and brings user to blog page upon completion
function submitPost (data) {
  $.ajax({
    type: "POST",
    url: "/api/blog",
    data: data
  }).then(function (res) {
    console.log(res);
    window.location.href = "/api/blog";
  });
}

// Gets post data for a post if we're editing
function getPostData (id) {
  $.ajax({
    type: "GET",
    url: "/api/blog"
  }).then(function (data) {
    if (data) {
      // If this post exists, prefill our cms forms with its data
      titleInput.val(data.heading);
      bodyInput.val(data.blurb);
      // If we have a post with this id, set a flag for us to know to update the post
      // when we hit submit
      updating = true;
    }
  });
}

// Update a given post, bring user to the blog page when done
function updatePost (post) {
  $.ajax({
    method: "PUT",
    url: "/api/blog",
    data: post
  })
    .then(function () {
      window.location.href = "/api/blog";
    });
}

// This function grabs posts from the database and updates the view
function getPosts () {
  $.get("/api/posts", function (data) {
    console.log("Posts", data);
    posts = data;
    if (!posts || !posts.length) {
      displayEmpty();
    } else {
      initializeRows();
    }
  });
}

// This function does an API call to delete posts
function deletePost (id) {
  $.ajax({
    method: "DELETE",
    url: "/api/posts/" + id
  })
    .then(function () {
      getPosts();
    });
}

// Getting the initial list of posts
getPosts();
// InitializeRows handles appending all of our constructed post HTML inside
// blogContainer
function initializeRows () {
  blogContainer.empty();
  const postsToAdd = [];
  for (let i = 0; i < posts.length; i++) {
    postsToAdd.push(createNewRow(posts[i]));
  }
  blogContainer.append(postsToAdd);
}

// This function constructs a post's HTML
function createNewRow (post) {
  const newPostCard = $("<div>");
  newPostCard.addClass("card");
  const newPostCardHeading = $("<div>");
  newPostCardHeading.addClass("card-header");
  const deleteBtn = $("<button>");
  deleteBtn.text("x");
  deleteBtn.addClass("delete btn btn-danger");
  const editBtn = $("<button>");
  editBtn.text("EDIT");
  editBtn.addClass("edit btn btn-default");
  const newPostTitle = $("<h2>");
  const newPostDate = $("<small>");
  const newPostCardBody = $("<div>");
  newPostCardBody.addClass("card-body");
  const newPostBody = $("<p>");
  newPostTitle.text(post.heading + " ");
  newPostBody.text(post.blurb);
  const formattedDate = new Date();
  newPostDate.text(formattedDate);
  newPostTitle.append(newPostDate);
  newPostCardHeading.append(deleteBtn);
  newPostCardHeading.append(editBtn);
  newPostCardHeading.append(newPostTitle);
  newPostCardBody.append(newPostBody);
  newPostCard.append(newPostCardHeading);
  newPostCard.append(newPostCardBody);
  newPostCard.data("post", post);
  return newPostCard;
}

// This function figures out which post we want to delete and then calls
// deletePost
function handlePostDelete () {
  const currentPost = $(this)
    .parent()
    .parent()
    .data("post");
  deletePost(currentPost.id);
}

// This function figures out which post we want to edit and takes it to the
// Appropriate url
function handlePostEdit () {
  const currentPost = $(this)
    .parent()
    .parent()
    .data("post");
  window.location.href = "/api/blog?post_id=" + currentPost.id;
}

// This function displays a message when there are no posts
function displayEmpty () {
  blogContainer.empty();
  const messageH2 = $("<h2>");
  messageH2.css({ "text-align": "center", "margin-top": "50px" });
  blogContainer.append(messageH2);
}

const url = window.location.search;
let postId;
if (url.indexOf("?post_id=") !== -1) {
  postId = url.split("=")[1];
  getPostData(postId);
}
