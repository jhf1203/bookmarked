/* eslint-disable eqeqeq */
$(document).ready(function () {
  // ==================== Book Actions

  // ========== Events

  const seedBooks = ["victoria", "james", "mary", "john", "patricia", "robert", "jennifer", "michael", "linda", "william", "elizabeth", "david", "barbara", "richard", "susan", "joseph", "jessica", "thomas", "sarah", "charles", "karen", "chris", "nancy", "daniel", "lisa", "matthew", "margaret", "anthony", "betty", "donald", "sandra", "mark", "ashley", "paul", "dorothy", "steven", "kim", "andrew", "emily", "ken", "donna", "josh", "michelle", "kevin", "carol"];
  const randomBook = seedBooks[Math.floor(Math.random() * seedBooks.length)];
  findBook("author", randomBook);

  $("#searchTitle").on("click", function () {
    const param = $(".search-field").val();
    findBook("title", param);
  });

  $("#searchAuthor").on("click", function () {
    const param = $(".search-field").val();
    findBook("author", param);
  });

  $(".refreshBtn").on("click", function (event) {
    event.preventDefault();
    findBook("author", randomBook);
  });

  $(document).on("change", ".selectBook", function (event) {
    event.preventDefault();
    const state = $(this).val();

    if (location.pathname.substring(0, 5) === "/user") {
      const bookId = $(this).parent().parent().siblings().children().attr("id");
      findFromModal(bookId, state);
    } else {
      const taCarry = $(this).parent().parent().siblings().html();
      const descCarry = $(this).parent().parent().siblings().next().html();
      const photoStart = $(this).parent().parent().parent().parent().siblings().html();
      const isbnCarry = $(this).parent().parent().parent().parent().siblings().children().attr("id");
      const stateCarry = $(this).val();
      const titleCarry = taCarry.substring(0, taCarry.indexOf("|")).trim();
      const authorCarry = taCarry.substring(taCarry.indexOf("|") + 1, taCarry.length).trim();

      // trimming excess text off of the captured image url
      const photoClipFront = photoStart.substring(photoStart.indexOf("="));
      const photoToArr = photoClipFront.split(" ");
      const photoToLetters = photoToArr[0].split("");
      const trimmedArr = [];
      for (let i = 2; i < (photoToLetters.length - 1); i++) {
        trimmedArr.push(photoToLetters[i]);
      }
      const imgStringCommas = trimmedArr.toString();
      const imgStringCorrect = imgStringCommas.replace(/,/g, "");
      const photoCarry = imgStringCorrect.replace(/amp;/g, "");

      const data = {
        title: titleCarry,
        author: authorCarry,
        photo: photoCarry,
        description: descCarry,
        state: stateCarry,
        isbn: isbnCarry
      };
      checkDuplicate(data);
    }
  });

  function findFromModal (id, state) {
    $.ajax({
      type: "GET",
      url: `/api/books/${id}`
    }).then(function (res) {
      addToList(state, res.title, res.id, res.author, res.photo, res.description, res.isbn);
    });
  }

  function checkDuplicate (data) {
    $.ajax({
      type: "GET",
      url: "/api/books"
    }).then(function (res) {
      const dupArr = [];
      for (let i = 0; i < res.length; i++) {
        if (res[i].isbn === data.isbn) {
          dupArr.push(res[i]);
        };
      };
      if (dupArr.length === 0) {
        addBookTwice(data);
      } else {
        addToList(data.state, data.title, data.id, data.author, data.photo, data.description, data.isbn);
      }
    });
  };

  function callSuccess () {
    location.reload();
  }

  function addBookTwice (data) {
    $.ajax({
      type: "POST",
      url: "/api/books",
      data: data
    }).then(function (res) {
      addToList(res.state, res.title, res.id, res.author, res.photo, res.description, res.isbn);
    });
  };

  function singleBookInfo (listId) {
    console.log("listId", listId);
    $.ajax({
      type: "GET",
      // Temporary fix below, change upon deployment.
      url: `/api/lists/${listId}`
    }).then(response => {
      console.log("Response: ", response)
      $(".modal-title-author-text").remove();
      $(".modal-img").remove();
      $(".modal-desc-text").remove();

      const modalTitleAuthor = $("<p>").attr("class", "modal-title-author-text").html(`${response.title} | ${response.author}`);
      $(".modal-title-author-row").append(modalTitleAuthor);
      const modalImg = $("<img>").attr("src", response.photo).attr("class", "modal-img").attr("id", listId);
      $(".modal-img-row").append(modalImg);
      const modalDescription = $("<p>").attr("class", "modal-desc-text").attr("id", response.BookId).html(response.description);
      $(".modal-desc-col").append(modalDescription);
    });
  }

  $(".list-card").on("click", function () {
    const internalBook = ($(this).attr("id"));
    singleBookInfo(internalBook);
  });

  $(".user-connection").on("click", function () {
    const userTarget = ($(this).attr("id"));
    const pastArr = [];
    const currentArr = [];
    const futureArr = [];
    $.ajax({
      type: "GET",
      url: "api/lists"
    }).then(function (res) {
      $(".modal-books").empty();
      for (let i = 0; i < res.length; i++) {
        if (res[i].UserId.toString() === userTarget && res[i].state === "past") {
          pastArr.push(res[i]);
        } else if (res[i].UserId.toString() === userTarget && res[i].state === "current") {
          currentArr.push(res[i]);
        } else if (res[i].UserId.toString() === userTarget && res[i].state === "future") {
          futureArr.push(res[i]);
        }
      };
      const pastHeading = $("<ul>").attr("class", "connection-book-header").text("Books I have read");
      const currentHeading = $("<ul>").attr("class", "connection-book-header").text("Books I am currently reading");
      const futureHeading = $("<ul>").attr("class", "connection-book-header").text("Books I would like to read");

      for (let i = 0; i < pastArr.length; i++) {
        const pastBook = $("<p>").attr("class", "connection-book-name").text(pastArr[i].title);
        pastHeading.append(pastBook);
      };
      for (let i = 0; i < currentArr.length; i++) {
        const currentBook = $("<p>").attr("class", "connection-book-name").text(currentArr[i].title);
        currentHeading.append(currentBook);
      };
      for (let i = 0; i < futureArr.length; i++) {
        const futureBook = $("<p>").attr("class", "connection-book-name").text(futureArr[i].title);
        futureHeading.append(futureBook);
      };

      $(".modal-books").append(pastHeading, currentHeading, futureHeading);
    });
  });

  $(".remove-button").on("click", function () {
    const entryId = $(this).parent().parent().siblings(".modal-img-row").children().attr("id");
    $.ajax({
      type: "DELETE",
      url: `api/lists/${entryId}`,
      data: entryId
    }).then(function (result) {
      location.reload();
    });
  });

  function findBook (val, query) {
    const queryURL = "https://www.googleapis.com/books/v1/volumes?q=in" + val + ":" + query + "&key=AIzaSyDWTm5Ri0oiuRWTkY3efShrFVhGS0UqNbI";
    $.ajax({
      type: "GET",
      url: queryURL
    }).then((response) => {
      $(".render-target").empty();
      const infoArr = [];
      for (let i = 0; i < response.items.length; i++) {
        infoArr.push(response.items[i].volumeInfo);
      }
      resultFilter(infoArr);
    });
  }

  function resultFilter (arr) {
    const goodArr = [];
    for (let i = 0; i < arr.length; i++) {
      const testArr = Object.keys(arr[i]);
      if (
        testArr.indexOf("title") >= 0 &&
        testArr.indexOf("authors") >= 0 &&
        testArr.indexOf("description") >= 0 &&
        testArr.indexOf("publishedDate") >= 0 &&
        testArr.indexOf("industryIdentifiers") >= 0 &&
        testArr.indexOf("imageLinks") >= 0) {
        goodArr.push(arr[i]);
      }
    }
    renderContent(goodArr);
  }

  function renderContent (arr) {
    for (let i = 0; i < 3; i++) {
      const topDiv = $("<div>").addClass("col-12 offset-lg-2").attr("id", `testId${i}`);
      const h2Div = $("<h2>").attr("id", "greatRead").text("Your next great read");
      const vbTopDiv = $("<div>").addClass("cardAll mb-3").css("max-width", "740px");
      topDiv.append(h2Div, vbTopDiv);
      const secondDiv = $("<div>").addClass("row no-gutters");
      vbTopDiv.append(secondDiv);
      const imgDiv = $("<div>").addClass("col-md-3 imgDiv");
      secondDiv.append(imgDiv);
      const bookImg = $("<img>").attr("src", arr[i].imageLinks.thumbnail).addClass(`book-image imgDiv${i}`).attr("id", arr[i].industryIdentifiers[0].identifier);
      const contentDiv = $("<div>").addClass("col-md-9");
      secondDiv.append(imgDiv, contentDiv);
      imgDiv.append(bookImg);
      const cardBody = $("<div>").addClass("card-body");
      contentDiv.append(cardBody);
      const authorTitle = $("<h5>").addClass(`title-author title-author${i}`).attr("id", arr[i].publishedDate).html(`${arr[i].title} | ${arr[i].authors[0]}`);
      const description = $("<p>").addClass("book-description").attr("id", `desc${i}`).html(arr[i].description);
      cardBody.prepend(authorTitle, description);
      const cardFooter = $("<div>").addClass("card-footer text-muted");
      cardBody.append(cardFooter);
      const dropDownDiv = $("<div>").addClass("dropdown");
      cardFooter.append(dropDownDiv);
      const selectBook = $("<select>").addClass("selectBook").attr("id", `select${i}`);
      dropDownDiv.append(selectBook);
      const optionPlaceholder = $("<option selected>").text("Add To My List");
      const optionPast = $("<option>").addClass("past").attr("value", "past").text("Have Read");
      const optionFuture = $("<option>").addClass("future").attr("value", "future").text("To Read");
      const optionCurrent = $("<option>").addClass("current").attr("value", "current").text("Currently Reading");
      selectBook.append(optionPlaceholder, optionPast, optionFuture, optionCurrent);

      $(".render-target").append(topDiv);
    }
  };

  function addToList (state, name, book, author, picture, desc, isbn) {
    const data = {
      state: state,
      title: name,
      isbn: isbn,
      author: author,
      photo: picture,
      description: desc,
      UserId: window.userId,
      BookId: book
    };
    console.log("here's who's logged in", data.userId);
    $.ajax({
      type: "POST",
      url: "/api/lists",
      data: data
    }).then(function (res) {
      callSuccess();
    });
  }

  function addConnection (me, you) {
    const data = {
      followerId: me,
      followeeId: you
    };
    $.ajax({
      type: "POST",
      url: "/api/connections",
      data: data
    }).then(function (res) {
    });
  }

  function addBlogPost (heading, blurb) {
    const data = {
      heading: heading,
      blurb: blurb,
      UserId: window.userId
    };
    $.ajax({
      type: "POST",
      url: "/api/blog",
      data: data
    }).then(function (res) {
    });
  };

  // ===================  User Actions

  // ==========  Events

  $("#add-user").on("click", function (event) {
    event.preventDefault();

    const newAccount = {
      firstName: $("#inputFirst").val().trim(),
      lastName: $("#inputLast").val().trim(),
      email: $("#inputEmail").val().trim(),
      password: $("#inputPassword").val().trim()
    };

    if (newAccount.password.length > 0 && newAccount.email.length > 0 && newAccount.password.length > 0 && newAccount.lastName.length > 0 && newAccount.firstName.length > 0) {
      $.ajax({
        type: "POST",
        url: "/api/register",
        data: newAccount
      }).then(() => {
        window.location.href = "/";
      });
    } else {
      $("#create-err-msg").empty("").text("**Please fill out entire form**");
    }
  });

  $("#update-user").on("click", function (event) {
    event.preventDefault();

    const id = $(this).data("id");

    // capture All changes
    const changeUser = {
      firstName: $("#inputFirst").val().trim(),
      lastName: $("#inputLast").val().trim(),
      email: $("#inputEmail").val().trim(),
      password: $("#inputPassword").val().trim()
    };
    $("#err-msg").empty("");
    // $('#change-user-modal').modal('show');
    console.log(changeUser);

    if (changeUser.password.length > 0 && changeUser.email.length > 0 && changeUser.password.length > 0 && changeUser.lastName.length > 0 && changeUser.firstName.length > 0) {
      $.ajax({
        type: "PUT",
        url: `/api/user/${id}`,
        data: changeUser
      }).then((result) => {
        // Reload the page to get the updated list
        window.location.href = "/logout";
      });
    } else {
      $("#update-err-msg").empty("").text("**Please fill out entire form**");
    }
  });

  $("#delete-user").on("click", function (event) {
    event.preventDefault();
    $("#err-msg").empty("");
    $("#delete-user-modal").modal("show");
  });

  $("#confirm-delete").on("click", function (event) {
    event.preventDefault();

    const id = $(this).data("id");

    const deleteUser = {
      email: $("#userEmail").val().trim(),
      password: $("#userPassword").val().trim()
    };

    if (deleteUser.email.length > 0 && deleteUser.password.length > 0) {
      $.ajax({
        type: "POST",
        url: "/api/user/confirm",
        data: deleteUser
      }).then((result) => {
        if (result) {
          $.ajax(`/api/user/${id}`, {
            type: "DELETE"
          }).then(() => {
            // Reload the page to get the updated list
            window.location.href = "/logout";
          });
        } else {
          $("#err-msg").empty("").text("Wrong credentials!");
        }
      });
    } else {
      $("#err-msg").empty("").text("fill out entire form");
    }
  });

  $("#register").on("click", function (event) {
    event.preventDefault();
    window.location.href = "/register";
  });

  $("#login-modal").on("click", function (event) {
    event.preventDefault();
    $("#user-info").modal("show");
  });

  $("#go-home").on("click", function (event) {
    event.preventDefault();
    window.location.href = "/";
  });

  $("#login").on("click", function (event) {
    event.preventDefault();

    const user = {
      email: $("#email").val().trim(),
      password: $("#user_password").val().trim()
    };

    $.post("/api/login", user, (result) => {
      if (result.loggedIn) {
        $(document.location).attr("href", "/dashboard");
      } else {
        $("#login-err-msg").empty("").text(result.error);
        $("#user-info").modal("hide");
      }
    });
  });

  $(".addUserButtonNew").on("click", function () {
    const you = ($(this).attr("id"));
    const me = (window.userId);
    console.log("me: ", me, " and you: ", you)
    addConnection(me, you);
  });

  // $(".connection-profile-button").on("click", function () {
  //   const user = $(this).attr("id").toString()
  //   window.location.href =`user/${user}`
  // })

  $("#blogSubmit").on("click", function (event) {
    const title = $("#blog-title").val();
    const body = $("#blog-body").val();
    // alert(`title is ${title} and body is ${body}`);
    addBlogPost(title, body);
  });

  $(".removeBlogButton").on("click", function () {
    const entryId = $(this).attr("id");

    $.ajax({
      type: "DELETE",
      url: `api/Blog/${entryId}`,
      data: entryId
    }).then(function (result) {
      location.reload();
    });
  });

  document.getElementById("upload_widget_opener").addEventListener("click", function () {
    // eslint-disable-next-line no-undef
    cloudinary.openUploadWidget({
      cloud_name: "bookmarked",
      upload_preset: "gkkjcgbg",
      cropping: true,
      croppingCoordinatesMode: "face",
      croppingAspectRatio: 1,
      showSkipCropButton: false
    },
    function (error, result) {
      if (error) throw error;

      $("#userImage").attr("src", result[0].url);
      console.log("result!", result)
      const profilePic = result[0].url;
      addPhoto(profilePic);
    });
  });

  function addPhoto (url) {
    const data = {
      type: "jpg",
      name: window.userId,
      data: url,
      UserId: window.userId
    };

    $.ajax({
      type: "POST",
      url: "/api/images",
      data: data
    }).then((res) => {
      console.log("res loaded!: ", res)
    });
  }
});
