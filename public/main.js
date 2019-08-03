$(function() {
  var socket = io();

  joypixels.imageTitleTag = false;
  joypixels.emojiSize = 64;

  socket.on("time", function(date) {
    $(".time-display").text(
      moment(date).format("dddd, MMMM Do YYYY, h:mm:ss a")
    );
  });

  function commentLink(article_id, article_comment_count) {
    return $("<a>")
      .addClass(" mr-2")
      .attr({
        href: "/article/" + article_id,
        title: "comment on the article"
      })
      .append(
        $("<span>")
          .addClass("notify-item")
          .append(
            article_comment_count > 0 &&
              $("<span>")
                .addClass("notify-badge badge badge-pill badge-danger")
                .text(article_comment_count),
            joypixels.toImage(":speech_balloon:")
          )
      );
  }

  function readLink(article_url) {
    return $("<a>")
      .addClass(" mr-2")
      .attr({
        href: article_url,
        target: "_blank",
        title: "read the whole article"
      })
      .append(joypixels.toImage(":book:"));
  }

  function whenScraped(date) {
    return $("<span>").text("[Scraped " + moment(date).calendar() + "]");
  }

  function addComment(comment) {
    $(".comment-list").append(
      $("<li>")
        .addClass("list-group-item")
        .append(
          $("<div>")
            .addClass("text-muted")
            .append(
              $("<span>").text(moment(comment.createdAt).calendar()),
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
  }

  $("form").on("submit", function(e) {
    e.preventDefault();
    var form = $(this);

    form.validate();

    var id = $(".article").data("id");
    var body = form
      .serializeArray()
      .reduce((p, c) => ({ ...p, [c.name]: c.value }), {});

    console.log({ id, body });

    axios
      .post(`/api/articles/${id}/comment`, body)
      .then(function(res) {
        addComment(res.data);
        form.trigger("reset");
      })
      .catch(function(err) {
        console.log(err.message);
      });
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
                  .addClass("badge badge-light")
                  .append(
                    readLink(article.url),
                    commentLink(article._id, article.comments.length),
                    whenScraped(article.createdAt)
                  ),
                $("<div>")
                  .addClass("alert alert-dark")
                  .text(article.summary)
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
            .addClass("badge badge-light")
            .append(readLink(article.url), whenScraped(article.createdAt)),
          $("<div>")
            .addClass("alert alert-dark")
            .text(article.summary)
        );

        $.each(comments, function() {
          addComment(this);
        });
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
