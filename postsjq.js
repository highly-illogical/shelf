let storedLinks = [];

$(function () {
  $.get('http://localhost:8080/api/bookmarks/all', (data) => {
    storedLinks = data;
  });

  setTimeout(() => showLinks(storedLinks), 100);

});

function addLink(item) {
  const shareButton = $("<button></button>").attr('class', 'btn btn-outline-primary btn-sm m-2')
    .text('Share');
  const removeButton = $("<button></button>").attr('class', 'btn btn-outline-danger btn-sm')
    .text('Remove');
  const addTextButton = $("<button></button>").attr('class', 'btn btn-outline-secondary btn-sm m-2')
    .text('Edit Text').hide();
  const tagList = $("<div></div>").attr('class', 'form-inline');
  item.tags.forEach(tag => {
    tagList.append($("<span></span>").attr('class', 'badge badge-pill badge-dark m-1').text(tag));
  });
  $('#linklist').prepend(
    $("<li></li>").attr('class', 'list-group-item').text(item.link)
      .append(shareButton, removeButton, addTextButton, tagList)
  );
}

function showLinks(links) {
  links.forEach(link => addLink(link));
}