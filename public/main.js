$(function() {
  var socket = io();

  joypixels.imageTitleTag = false;
  joypixels.emojiSize = 64;

  socket.on("time", function(date) {
    $(".time-display").text(
      moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")
    );
  });
  
  $("form").on("submit", function(e) {
    e.preventDefault();
    console.log($(this).serializeArray());
  });

  if ($(".article-list").length > 0) {
    console.log("load article list...");

    axios("/api/articles/scrape")
      .then(function(res) {
        $(".article-list").empty();

        $.each(res.data, function() {
          var article = this;

          $(".article-list").append(
            $("<li>")
              .addClass("list-group-item")
              .append(
                $("<h4>").text(article.headline),
                $("<div>")
                  .addClass("text-muted")
                  .text(article.summary),
                $("<a>")
                  .attr({
                    href: article.url,
                    target: "_blank",
                    title: "read the whole article"
                  })
                  .append(joypixels.toImage(":book:")),
                $("<a>")
                  .attr({
                    href: "/article/" + article._id,
                    title: "comment on the article"
                  })
                  .append(joypixels.toImage(":speech_balloon:"))
              )
          );
        });
      })
      .catch(function(err) {
        console.error(err);
      });
  }

  if ($(".article").length > 0) {
    console.log("load article...");

    var id = $(".article").data("id");

    axios(`/api/articles/${id}`)
      .then(function(res) {
        var article = res.data;
        var comments = article.comments;

        $(".article").append(
          $("<h4>").text(article.headline),
          $("<div>")
            .addClass("text-muted")
            .text(article.summary),
          $("<a>")
            .attr({
              href: article.url,
              target: "_blank",
              title: "read the whole article"
            })
            .append(joypixels.toImage(":book:"))
        );

        if (Array.isArray(comments)) {
          // $(".comment-list").empty();

          $.each(comments, function() {
            var comment = this;

            $(".comment-list").append(
              $("<li>")
                .addClass("list-group-item")
                .append(
                  $("<div>")
                    .addClass("text-muted")
                    .append(
                      $("<span>").text(moment(comment.date).calendar()),
                      $("<span>")
                        .addClass("mx-1")
                        .text("by"),
                      $("<span>").text(comment.author)
                    ),
                  $("<div>")
                    .addClass("border rounded p-2 bg-light")
                    .text(comment.text)
                )
            );
          });
        }
      })
      .catch(function(err) {
        if (err.response) {
          $(".article").append($("<div>").text("Article Not Found 😢"));
        } else {
          $(".article").append($("<div>").text(err));
        }

        console.log(err.config);
      });
  }
});
