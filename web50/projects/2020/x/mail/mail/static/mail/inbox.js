document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);
  // By default, load the inbox
  load_mailbox('inbox');
  //liten to user hitting submit button to send an email
  document.querySelector("#submit_email").addEventListener('click', () => {
    let recipients = document.getElementById("compose-recipients").value;
    let body = document.getElementById("compose-body").value;
    let subject = document.getElementById("compose-subject").value;
    send_email(recipients, subject, body);
  });
  


  });
  
function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
  
}

function load_mailbox(mailbox) {


  emails = get_mailboxEmais(mailbox);
  console.log(emails);

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


  var divAtual = document.getElementById('emails-view');

  for(let i=0; i<5; i++){

    let sender = emails[i]['sender'];
    let timestamp = emails[i]['timestamp'];
    let subject = emails[i]['subject'];


    let container = document.createElement('div');
    container.classList.add("card", "border-primary", "mb-3", "container");
    let container_row1 = document.createElement('div');
    container_row1.classList.add("card-header", "row");
    container.appendChild(container_row1);

    let row_1_col_1 = document.createElement('div');
    row_1_col_1.classList.add("col-sm-8");
    container_row1.appendChild(row_1_col_1);

    let row_1_col1_content = document.createElement("h5");
    row_1_col1_content.innerHTML = sender;
    row_1_col_1.appendChild(row_1_col1_content);

    let row_1_col_2 = document.createElement('div');
    row_1_col_2.classList.add("col-sm-4");
    container_row1.appendChild(row_1_col_2);

    let row_1_col_2_content = document.createElement('p');
    row_1_col_2_content.classList.add("card-text");
    row_1_col_2_content.innerHTML = timestamp;
    row_1_col_2.appendChild(row_1_col_2_content);

    let row_2 = document.createElement('div');
    row_2.classList.add("card-body", "text-primary");
    container.appendChild(row_2);

    let row_2_content = document.createElement('h5');
    row_2_content.classList.add("card-title");
    row_2_content.innerHTML = subject;
    row_2.appendChild(row_2_content);

    divAtual.appendChild(container);//adiciona o nó de texto à nova div criada
  }
    
  
}

function send_email(c_recipient, c_subject, c_body){
  //receives the infos about the email writed and send a POST request with Json body
  fetch('/emails', {method: 'POST', body: JSON.stringify({
    recipients: c_recipient,
    subject: c_subject,
    body: c_body })
   });
   //redirects to 'sent' mailbox
   load_mailbox('sent');

}

function get_mailboxEmais(mailbox){
  fetch("/emails/"+mailbox)
  .then(response => response.json())
  .then(emails => {
    console.log(emails);
    data_ = emails;
  });
  return data_;
}