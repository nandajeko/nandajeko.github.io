$("#top").lettering();
$("#bottom").lettering();

function flipCover(css, options) {
  var options = options || {};
  if (typeof css === "object") {
    options = css;
  } else {
    options.css = css;
  }

  var css = options.css;
  var url = options.url;
  var text = options.text || css;
  var width = options.width;
  var height = options.height;

  var $section = $(".flip-cover-" + css).addClass(css + "-section");
  var $button = $("<div>").addClass(css + "-button");
  var $cover = $("<div>").addClass(css + "-cover");
  var $outer = $("<div>").addClass(css + "-outer");
  var $inner = $("<div>").addClass(css + "-inner");

  if (width) {
    $section.css("width", width);
  }

  if (height) {
    $section.css("height", height);

    var lineHeight = ":after{ line-height: " + height + ";}";
    var $outerStyle = $("<style>").text("." + css + "-outer" + lineHeight);
    $outerStyle.appendTo($outer);
    var $innerStyle = $("<style>").text("." + css + "-inner" + lineHeight);
    $innerStyle.appendTo($inner);
  }

  $cover.html($outer);
  $inner.insertAfter($outer);

  $button.html($("<a>").text(text).attr("href", url));

  $section.html($button);
  $cover.insertAfter($button);
}

flipCover({
  css: "flipcover",
  url: ".//letter/letter.html",
  text: "Let's live the moment!!",
  width: "160px",
});

TweenMax.to("#feturbulence", 5, {
  attr: { baseFrequency: "0.06 0" },
  repeat: -1,
  yoyo: true,
  ease: Linear.easeNone,
});

TweenMax.to(
  ".jellyfish",
  3,
  {
    y: -30,
    repeat: -1,
    yoyo: true,
    ease: Linear.easeNone,
  },
  0.2
);

TweenMax.staggerFrom(
  ".bubble",
  4,
  {
    scale: 0.2,
    opacity: 0.2,
    repeat: -1,
    yoyo: true,
    svgOrigin: "center",
    ease: Linear.easeNone,
  },
  1
);

var blink = new TimelineMax({ repeat: -1, repeatDelay: 5 });
blink
  .to(".eye", 0.5, {
    scaleY: 0.5,
    opacity: 0.2,
    svgOrigin: "center",
    delay: 3,
    ease: Back.easeOut.config(1.7),
  })
  .to(".eye", 0.5, {
    scaleY: 1,
    opacity: 1,
    svgOrigin: "center",
    ease: Back.easeOut.config(1.7),
  });
