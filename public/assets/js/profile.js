// This is a separate file because it will be triggered on window.ready (eventually document.ready) to render the user's profile who is logged in.

$("#btnFollowers").on("click", function () {
  const idToUse = $(this).attr("id").val();
  getFollowers(idToUse);
});

$("#btnFollowing").on("click", function () {
  const idToUse = $(this).attr("id").val();
  getFollowing(idToUse);
});

$(".user-connection").on("click", function () {
  const idToUse = $(this).attr("id").val();
  getUserInfo(idToUse);
});

function getFollowers (id) {
  $.ajax({
    type: "GET",
    url: `/api/connections/`
  }).then(function (res) {
    // This will be a function that renders the list of the user's followers dynamically in the modal
    renderFollowers(res);
  });
}

function getFollowing (id) {
  $.ajax({
    type: "GET",
    url: `api/connections/`
  }).then(function (res) {
    // This will be a function that renders the list of who the user following in the modal
    renderFollowing(res);
  });
}

function renderFollowing(id) {
  const arrFollowing = [];
  const userPage = 3
  
  for (let i = 0; i < id.length; i++) {
    if (id[i].followerId === userPage) {
      let followerLine = $("<p>").
    }
  }
}

function getUserProfile (id) {
  getUserInfo(id);
  getUserList(id);
}

function getUserInfo (id) {
  $.ajax({
    type: "GET",
    url: `/api/userInfo/${id}`
  }).then(function (res) {
    //   This will be a function that renders the user's info that's found under the "User" model
    renderUserInfo(res);
  });
}

function getUserList (id) {
  $.ajax({
    type: "GET",
    url: `api/lists/${id}`
  }).then(function (res) {
    //   This will be a function that renders the user's list data, the backend route is set to include the "Book" model along with the "List" one, which is how we will populate the book images.
    renderUserList(res);
  });
}
