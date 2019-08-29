let storedLinks = [], allLinks = [];

$(function () {
  $.get('http://localhost:8080/api/bookmarks/all', (data) => {
    allLinks = data;
    storedLinks = allLinks.filter(link => link._id.length);
  });

  $('#add').click((e) => {
    addLink($('#link').val());
    $('#link').val("");
  });

  setTimeout(() => showLinks(storedLinks), 100);

});

function findLinkIndex(link) {
  return storedLinks.findIndex(item => item.link === link);
}

function openShareWindow(link) {
  window.open('https://www.facebook.com/sharer.php?u=' + link);
}

function addLink(link) {
  if (findLinkIndex(link) !== -1) {
    alert('This link is already in the list');
  } else {
    linkItem = {
      link: link,
      tags: [],
      text: '(No text)'
    };

    $.ajax({
      url: 'http://localhost:8080/api/bookmarks',
      method: "POST",
      contentType: "application/json",
      data: JSON.stringify(linkItem)
    }).done((data) => {
      linkItem._id = data._id;
      storedLinks.push(linkItem);
      displayLink(linkItem);
    })
  }
}

function removeLink(i) {
  linkToRemove = storedLinks.splice(i, 1)[0];
  $('#linklist').children(`:nth-child(${storedLinks.length - i + 1})`).remove();

  $.ajax({
    url: 'http://localhost:8080/api/bookmarks',
    method: "DELETE",
    contentType: "application/json",
    data: JSON.stringify(linkToRemove)
  }).done(() => alert("Link removed"));
}

function addNewTag(i, tag) {
  storedLinks[i].tags.push(tag);

  $('#linklist').children(`:nth-child(${storedLinks.length - i})`)
    .find(".input-group").before($("<span></span>")
      .attr('class', 'badge badge-pill badge-dark m-1').text(tag));

  $('#linklist').children(`:nth-child(${storedLinks.length - i})`)
    .find("input").val("");

  $.ajax({
    url: 'http://localhost:8080/api/bookmarks',
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(storedLinks[i])
  });
}

function updateText(i, newtext) {
  storedLinks[i].text = newtext;

  $.ajax({
    url: 'http://localhost:8080/api/bookmarks',
    method: "PUT",
    contentType: "application/json",
    data: JSON.stringify(storedLinks[i])
  });
}

function displayLink(item) {
  const shareButton = $("<button></button>")
    .attr('class', 'btn btn-outline-primary btn-sm m-2')
    .text('Share').click(() => openShareWindow(item.link));

  const removeButton = $("<button></button>")
    .attr('class', 'btn btn-outline-danger btn-sm')
    .text('Remove').click(() => removeLink(findLinkIndex(item.link)));

  const addTextButton = $("<button></button>")
    .attr('class', 'btn btn-outline-secondary btn-sm m-2')
    .text('Edit Text').hide().click(function () {
      let index = findLinkIndex(item.link);

      if ($(this).text() === 'Edit Text') {
        $(this).attr('class', 'btn btn-outline-info btn-sm m-2')
          .text("Save");
        let text = $(this).next().text();
        $(this).next().replaceWith($("<textarea></textarea>")
          .attr('class', 'form-control m-2')
          .css('font-size', '14.5px').val(text));
      }
      else if ($(this).text() === 'Save') {
        $(this).attr('class', 'btn btn-outline-secondary btn-sm m-2')
          .text("Edit Text");
        let text = $(this).next().val();
        updateText(index, text);
        $(this).next().replaceWith($("<div></div>")
          .attr('class', 'textshow').css({
            "margin": "10px 10px 20px 20px",
            "font-size": "14.5px",
            "color": "rgb(90, 90, 90)"
          }).text(text));
      }
    });

  const tagList = $("<div></div>").attr('class', 'form-inline').hide();

  item.tags.forEach(tag => {
    tagList.append($("<span></span>")
      .attr('class', 'badge badge-pill badge-dark m-1')
      .css('cursor', 'pointer').text(tag)
      .click(function () {
        storedLinks = allLinks.filter(link => link.tags.includes($(this).text()));
        $('#linklist').empty();
        showLinks(storedLinks);
      }));
  });

  const addTag = $("<input></input>").attr({
    class: "form-control form=control-sm",
    type: "text",
    placeholder: "Add tags"
  }).css({
    "font-size": "12px",
    "margin": "0 0 0 10px"
  });

  const addTagButton = $("<button></button>").attr({
    class: 'btn btn-light btn-sm'
  }).css({
    "border-color": "lightgrey",
    "color": "grey",
    "font-size": "10px"
  }).text("+").click(function (e) {
    let index = $(this).parents("li").nextAll().length;
    addNewTag(index, $(this).parent().prev().val());
  });

  const innerTag = $("<div></div>")
    .attr("class", "input-group-append").append(addTagButton);
  tagList.append($("<div></div>")
    .attr("class", "input-group").css("width", "200px")
    .append(addTag, innerTag));

  const textShow = $("<div></div>")
    .attr('class', 'textshow').css({
      "margin": "10px 10px 20px 20px",
      "font-size": "14.5px",
      "color": "rgb(90, 90, 90)"
    }).text(item.text).hide();

  $('#linklist').prepend(
    $("<li></li>").attr('class', 'list-group-item')
      .text(item.link)
      .append(shareButton, removeButton, addTextButton, textShow, tagList)
      .click(function (e) {
        if (e.target == this) {
          $(this).find('.btn-outline-secondary, .form-inline, .textshow').toggle();
        }
      })
  );
}

function showLinks(links) {
  links.forEach(link => displayLink(link));
}