/* eslint-disable eqeqeq */
$(document).ready(function () {
  // ==================== Book Actions

  // ========== Events

  const seedBooks = ["cat", "earth", "run", "fire", "hunger", "Winter", "world", "tomorrow", "the", "turn", "fly", "moon", "tales", "dog", "star", "power", "catch", "feel", "house", "event", "game", "valor", "war", "prince", "woman", "man", "pirate", "fish", "fantasy", "stories", "evil", "good", "truth"];
  const randomBook = seedBooks[Math.floor(Math.random() * seedBooks.length)];
  findBook("title", randomBook);

  // const searchTerm = $('#searchBook').val();

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
    findBook("title", randomBook);
  });

  $("select").on("change", function (event) {
    event.preventDefault();
    console.log($(this).val());

    const taCarry = $(this).parent().parent().siblings().html();
    const descCarry = $(this).parent().parent().siblings().next().html();
    const photoStart = $(this).parent().parent().parent().parent().siblings().html();
    const isbnCarry = $(this).parent().parent().parent().parent().siblings().children().attr("id");
    const stateCarry = $(this).val();
    const titleCarry = taCarry.substring(0, taCarry.indexOf("|")).trim();
    const authorCarry = taCarry.substring(taCarry.indexOf("|") + 1, taCarry.length).trim();
    const photoCarry = photoStart.substring(photoStart.indexOf("h"));
    console.log("isbn", isbnCarry);
    console.log("pic", photoCarry);

    const data = {
      title: titleCarry,
      author: authorCarry,
      photo: photoCarry,
      description: descCarry,
      state: stateCarry,
      isbn: isbnCarry
    };
    checkDuplicate(data);
  });

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
        addToList(data.state, data.title, data.id);
      }
    });
  };

  function addBookTwice (data) {
    $.ajax({
      type: "POST",
      url: "/api/books",
      data: data
    }).then(function (res) {
      console.log(res, res.state, window.userId);
      addToList(res.state, res.title, res.id);
    });
  };

  $(".user-connection").on("click", function () {
    const userTarget = ($(this).attr("id"));
    console.log("user target", userTarget);
    const pastArr = [];
    const currentArr = [];
    const futureArr = [];
    $.ajax({
      type: "GET",
      url: "api/lists"
    }).then(function (res) {
      $(".modal-books").empty();
      console.log(res);
      for (let i = 0; i < res.length; i++) {
        if (res[i].UserId.toString() === userTarget && res[i].state === "past") {
          pastArr.push(res[i]);
        } else if (res[i].UserId.toString() === userTarget && res[i].state === "current") {
          currentArr.push(res[i]);
        } else if (res[i].UserId.toString() === userTarget && res[i].state === "future") {
          futureArr.push(res[i]);
        }
      };
      console.log("pastArr length is ", pastArr.length, "current is ", currentArr.length, "and future is ", futureArr.length);
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
    const entryId = $(this).attr("id");
    console.log($(this).parent());
    console.log(entryId);
    $.ajax({
      type: "DELETE",
      url: `api/lists/${entryId}`,
      data: entryId
    }).then(function (result) {
      location.reload();
      console.log(result);
    });
  });

  function findBook (val, query) {
    const queryURL = "https://www.googleapis.com/books/v1/volumes?q=in" + val + ":" + query + "&key=AIzaSyAGwS80on7Jfqi4kEejw10c-FfiMIUDj_I";
    console.log(queryURL);
    $.ajax({
      type: "GET",
      url: queryURL
    }).then((response) => {
      $(".title-author").remove();
      $(".book-description").remove();
      $(".book-image").remove();

      // First Card
      const bookTitle5 = response.items[0].volumeInfo.title;
      const author5 = response.items[0].volumeInfo.authors[0];
      const description5 = response.items[0].volumeInfo.description;
      const image5 = response.items[0].volumeInfo.imageLinks.thumbnail;
      const date5 = response.items[0].volumeInfo.publishedDate;
      const isbn5 = response.items[0].volumeInfo.industryIdentifiers[0].identifier;
      console.log(bookTitle5);
      console.log(author5);
      console.log(description5);
      console.log(image5);
      console.log(date5);
      console.log(isbn5);

      // Second Card
      const bookTitle6 = response.items[1].volumeInfo.title;
      const author6 = response.items[1].volumeInfo.authors[0];
      const description6 = response.items[1].volumeInfo.description;
      const image6 = response.items[1].volumeInfo.imageLinks.thumbnail;
      const date6 = response.items[1].volumeInfo.publishedDate;
      const isbn6 = response.items[1].volumeInfo.industryIdentifiers[0].identifier;
      console.log(bookTitle6);
      console.log(author6);
      console.log(description6);
      console.log(image6);
      console.log(date6);
      console.log(isbn6);
      // Third Card
      const bookTitle7 = response.items[2].volumeInfo.title;
      const author7 = response.items[2].volumeInfo.authors[0];
      const description7 = response.items[2].volumeInfo.description;
      const image7 = response.items[2].volumeInfo.imageLinks.thumbnail;
      const date7 = response.items[2].volumeInfo.publishedDate;
      const isbn7 = response.items[2].volumeInfo.industryIdentifiers[0].identifier;
      console.log(bookTitle7);
      console.log(author7);
      console.log(description7);
      console.log(image7);
      console.log(date7);
      console.log(isbn7);
      const titleAuthorSpace5 = $("<h5>").attr("class", `title-author`).attr("id", `${date5}`).html(`${bookTitle5} | ${author5}`);
      const titleAuthorSpace6 = $("<h5>").attr("class", `title-author`).attr("id", `${date6}`).html(`${bookTitle6} | ${author6}`);
      const titleAuthorSpace7 = $("<h5>").attr("class", `title-author`).attr("id", `${date7}`).html(`${bookTitle7} | ${author7}`);
      const descSpace5 = $("<p>").attr("class", "book-description desc5").html(`${description5}`);
      const descSpace6 = $("<p>").attr("class", "book-description desc6").html(`${description6}`);
      const descSpace7 = $("<p>").attr("class", "book-description desc7").html(`${description7}`);
      const imgSpace5 = $("<img>").attr("src", image5).attr("class", "book-image").attr("id", `${isbn5}`);
      const imgSpace6 = $("<img>").attr("src", image6).attr("class", "book-image").attr("id", `${isbn6}`);
      const imgSpace7 = $("<img>").attr("src", image7).attr("class", "book-image").attr("id", `${isbn7}`);

      console.log("5", descSpace5.text());
      console.log("6", descSpace6.text());
      console.log("7", descSpace7.text());

      console.log("is it undefined?", descSpace5.text() == "undefined");
      console.log("is it undefined?", descSpace6.text() == "undefined");
      console.log("is it undefined?", descSpace7.text() == "undefined");

      if (descSpace5.html() === "undefined") {
        descSpace5.css("color", "#fff");
      };

      if (descSpace6.html() == "undefined") {
        descSpace6.css("color", "#fff");
      }

      if (descSpace7.html() == "undefined") {
        descSpace6.css("color", "#fff");
      }

      $("#cardBody5").prepend(titleAuthorSpace5, descSpace5);
      $(".imgDiv5").append(imgSpace5);
      $("#cardBody6").prepend(titleAuthorSpace6, descSpace6);
      $(".imgDiv6").append(imgSpace6);
      $("#cardBody7").prepend(titleAuthorSpace7, descSpace7);
      $(".imgDiv7").append(imgSpace7);
    }).catch(error => {
      console.log(error);
    });
  };

  function addToList (state, name, book) {
    const data = {
      state: state,
      title: name,
      UserId: window.userId,
      BookId: book
    };
    $.ajax({
      type: "POST",
      url: "/api/lists",
      data: data
    }).then(function (res) {
      console.log(res);
    });
  }

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
      console.log("**Please fill out entire form**");
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
        console.log("Updated user:", result);
        // Reload the page to get the updated list
        window.location.href = "/logout";
      });
    } else {
      console.log("**Please fill out entire form**");
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
            console.log("Deleted user", deleteUser);
            // Reload the page to get the updated list
            window.location.href = "/logout";
          });
        } else {
          $("#err-msg").empty("").text("Wrong credentials!");
        }
      });
    } else {
      console.log("fill out entire form");
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
      // console.log(result);
      if (result.loggedIn) {
        $(document.location).attr("href", "/dashboard");
      } else {
        $("#login-err-msg").empty("").text(result.error);
        $("#user-info").modal("hide");
      }
    });
  });

  function imageUpload (file) {
    $.ajax({
      type: "POST",
      url: "/api/upload",
      data: file
    }).then((data) => {
      console.log(data);
    });
  }

  $("#submitButton").on("click", function () {
    const fileName = $("#input-files").val();
    console.log(fileName);
    imageUpload(fileName);
  });
});
