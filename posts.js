function showLinks() {
  storedLinks.forEach(item => addLink(item));
}

function createTextShow(text) {
  const textShow = document.createElement('div');
  textShow.style.margin = '10px 10px 20px 20px';
  textShow.style.fontSize = '14.5px';
  textShow.style.color = 'rgb(90, 90, 90)';
  textShow.style.display = 'none';
  textShow.appendChild(document.createTextNode(text));
  return textShow;
}

function addLink(item) {
  const newLink = document.createElement('li');
  newLink.setAttribute('class', 'list-group-item');
  newLink.appendChild(document.createTextNode(item.link));

  const shareButton = document.createElement('button');
  shareButton.setAttribute('class', 'btn btn-outline-primary btn-sm m-2');
  shareButton.innerText = 'Share';

  const removeButton = document.createElement('button');
  removeButton.setAttribute('class', 'btn btn-outline-danger btn-sm');
  removeButton.innerText = 'Remove';

  const addTextButton = document.createElement('button');
  addTextButton.setAttribute('class', 'btn btn-outline-secondary btn-sm m-2');
  addTextButton.innerText = 'Edit Text';
  addTextButton.style.display = 'none';

  const tagList = document.createElement('div');
  tagList.setAttribute('class', 'form-inline');
  tagList.style.display = 'none';

  item.tags.forEach(tag => {
    const badge = document.createElement('span');
    badge.setAttribute('class', 'badge badge-pill badge-dark m-1');
    badge.innerText = tag;
    tagList.appendChild(badge);
  });

  const addTag = document.createElement('input');
  const addTagButton = document.createElement('button');
  const outerTag = document.createElement('div');
  const innerTag = document.createElement('div');

  addTag.setAttribute('class', 'form-control form-control-sm');
  addTag.setAttribute('type', 'text');
  addTag.setAttribute('placeholder', 'Add tags');
  addTag.style.fontSize = '12px';
  addTag.style.margin = '0 0 0 10px';
  addTagButton.setAttribute('class', 'btn btn-light btn-sm');
  addTagButton.style.borderColor = 'lightgrey';
  addTagButton.style.color = 'grey';
  addTagButton.style.fontSize = '10px';
  addTagButton.innerText = '+';
  outerTag.setAttribute('class', 'input-group');
  outerTag.style.width = '200px';
  innerTag.setAttribute('class', 'input-group-append');

  innerTag.appendChild(addTagButton);
  outerTag.appendChild(addTag);
  outerTag.appendChild(innerTag);
  tagList.appendChild(outerTag);

  newLink.appendChild(shareButton);
  newLink.appendChild(removeButton);
  newLink.appendChild(addTextButton);
  newLink.appendChild(createTextShow(item.text));
  newLink.appendChild(tagList);
  list.prepend(newLink);
}

function removeLink(i) {
  linkToRemove = storedLinks.splice(i, 1)[0];
  list.childNodes[list.childNodes.length - i - 1].remove();

  fetch('http://localhost:8080/api/bookmarks/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(linkToRemove)
  });
}

function updateText(i, newtext) {
  storedLinks[i].text = newtext;

  fetch('http://localhost:8080/api/bookmarks/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(storedLinks[i])
  });
}

function addNewTag(i, newtag) {
  storedLinks[i].tags.push(newtag);
  console.log(storedLinks[i].tags);

  fetch('http://localhost:8080/api/bookmarks/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(storedLinks[i])
  });
}

function openShareWindow(link) {
  window.open('https://www.facebook.com/sharer.php?u=' + link);
}

document.addEventListener('DOMContentLoaded', function(event) {
  list = document.querySelector('#linklist');

  fetch('http://localhost:8080/api/bookmarks/all')
    .then(response => {
      return response.json();
    })
    .then(json => {
      storedLinks = json;
      showLinks();
    })
    .catch(error => alert('Something went wrong'));

  addButton = document.querySelector('#add');

  addButton.addEventListener('click', function(event) {
    link = document.querySelector('#link');

    if (storedLinks.findIndex(item => item.link === link.value) !== -1) {
      alert('This link is already in the list');
    } else {
      linkItem = {
        link: link.value,
        tags: [],
        text: '(No text)'
      };
      addLink(linkItem);

      fetch('http://localhost:8080/api/bookmarks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(linkItem)
      })
        .then(response => response.json())
        .then(json => (linkItem._id = json._id));
      storedLinks.push(linkItem);
      link.value = null;
    }
  });

  list.addEventListener('click', function(event) {
    if (event.target.classList.contains('btn')) {
      let targetLink = event.target.parentNode.firstChild.nodeValue;

      if (event.target.classList.contains('btn-outline-primary')) {
        openShareWindow(targetLink);
      } else if (event.target.classList.contains('btn-outline-danger')) {
        removeLink(storedLinks.findIndex(item => item.link === targetLink));
      } else if (event.target.classList.contains('btn-outline-secondary')) {
        const textEdit = document.createElement('textarea');
        textEdit.setAttribute('class', 'form-control m-2');
        textEdit.style.fontSize = '14.5px';
        textEdit.value = event.target.parentNode.childNodes[4].innerText;

        event.target.parentNode.childNodes[4].replaceWith(textEdit);
        event.target.setAttribute('class', 'btn btn-outline-info btn-sm m-2');
        event.target.innerText = 'Save';
      } else if (event.target.classList.contains('btn-outline-info')) {
        const textShow = createTextShow(
          event.target.parentNode.childNodes[4].value
        );
        event.target.parentNode.childNodes[4].replaceWith(textShow);
        event.target.parentNode.childNodes[4].style.display = '';

        updateText(
          storedLinks.findIndex(item => item.link === targetLink),
          textShow.innerText
        );

        event.target.setAttribute(
          'class',
          'btn btn-outline-secondary btn-sm m-2'
        );
        event.target.innerText = 'Edit Text';
      } else if (event.target.classList.contains('btn-light')) {
        let targetLink =
          event.target.parentNode.parentNode.parentNode.parentNode.firstChild
            .nodeValue;
        const newTag = document.createElement('span');
        newTag.setAttribute('class', 'badge badge-pill badge-dark m-1');
        newTag.innerText = event.target.parentNode.previousSibling.value;
        event.target.parentNode.parentNode.parentNode.insertBefore(
          newTag,
          event.target.parentNode.parentNode
        );
        event.target.parentNode.previousSibling.value = '';

        addNewTag(
          storedLinks.findIndex(item => item.link === targetLink),
          newTag.innerText
        );
      }
    } else {
      let toggle =
        event.target.childNodes[3].style.display === 'none' ? '' : 'none';
      event.target.childNodes[3].style.display = toggle;
      event.target.childNodes[4].style.display = toggle;
      event.target.childNodes[5].style.display = toggle;
    }
  });
});
