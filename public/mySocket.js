var socket = io("https://yodoteam.herokuapp.com/");

socket.on("server-send-dki-thatbai", function () {
  alert("Sai Username (co nguoi da dang ki roi!!!)");
});

socket.on("server-send-danhsach-Users", function (data) {
  $("#boxContent").html("");
  data.forEach(function (i) {
    $("#boxContent").append("<div class='user'>" + i + "</div>");
  });
});

socket.on("server-send-dki-thanhcong", function (data) {
  $("#currentUser").html(data);
  $("#loginForm").hide(2000);
  $("#chatForm").show(1000);
});

socket.on("server-send-mesage", function (data) {
  $("#listMessages").append("<div class='me' id='user' style='color:blue'>" + data.un + ":" + data.nd + "</div>");
});
socket.on("bot-send-mesage", function (data) {
  $("#listMessages").append("<div class='bot' id='bot' style='color:red'>" + data.un + ":" + data.nd + "</div>");
});

socket.on("user_typing", function (data) {
  $("#thongbao").html("<img width='20px' src='typing05.gif'> " + data);
});

socket.on("user_stop_typing", function () {
  $("#thongbao").html("");
});


$(document).ready(function () {
  $("#loginForm").show();
  $("#chatForm").hide();

  $("#txtMessage").focusin(function () {
    socket.emit("typing");
  })

  $("#txtMessage").focusout(function () {
    socket.emit("user_stop_typing");
  })

  $("#btnRegister").click(function () {
    socket.emit("client-send-Username", $("#txtUsername").val());
  });

  $("#btnLogout").click(function () {
    socket.emit("logout");
    $("#chatForm").hide(2000);
    $("#loginForm").show(1000);
  });
  $("#btnSendMessage").click(function () {
    socket.emit("send-message-to-bot", $("#txtMessage").val());
    $('#txtMessage').val("");
  });

});
