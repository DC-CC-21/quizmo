interface account {
  username: string;
  user_email: string;
  user_password: string;
}

const accounts: Array<account> = [
  {
    username: "public",
    user_email: "public",
    user_password: "public",
  },
  {
    username: "Batman",
    user_email: "bat@bat.net",
    user_password: "ironmansucks",
  },
];
const quiz = {
  HTML: [
    {
      question: "What does HTML stand for?",
      answer: "Hyper Text Markup Language",
    },
    {
      question: "Choose the correct HTML element for the largest heading",
      answer: "&lt;h1&gt;",
    },
    {
      question: "What is the correct HTML element for inserting a line break?",
      answer: "&lt;br&gt;",
    },
    {
      question: "What is the correct HTML element to define emphasized text?",
      answer: "&lt;em&gt;",
    },
    {
      question:
        "Which HTML element is used to specify a footer for a document or section?",
      answer: "&lt;footer&gt;",
    },
    {
      question: "Extra question",
      answer: "answers here",
    },
  ],
  Css: [
    {
      question: "What does CSS stand for?",
      answer: "Cascading Style Sheets",
    },
    {
      question:
        "What is the correct HTML for referring to an external style sheet?",
      answer:
        "&lt;link rel='stylesheet' type='text/css' href='mystyle.css'&gt;",
    },
    {
      question:
        "Where in an HTML document is the correct place to refer to an external style sheet?",
      answer: "In the &lt;head&gt; section",
    },
    {
      question: "Which HTML tag is used to define an internal style sheet?",
      answer: "&lt;style&gt;",
    },
    {
      question: "How do you insert a comment in a CSS file?",
      answer: "/* this is a comment */",
    },
  ],
  Javascript: [
    {
      question: "Inside which HTML element do we put the Javascript?",
      answer: "&lt;script&gt;",
    },
    {
      question:
        "What is the correct Javascript syntax to change the content of the HTML element below? <br> &lt;p id='demo'&gt;Change Me!&lt;/p&gt;",
      answer: "document.getElementById('demo').innerHTML = 'Hello World'",
    },
    {
      question: "Where is the correct place to insert a Javascript?",
      answer: "In the &lt;head&gt; or &lt;body&gt; section",
    },
    {
      question:
        "What is the correct syntax for referring to an external script called 'myfile.js'",
      answer: "&lt;script src='myfile.js'&gt;",
      options: [
        "&lt;javascript src='myfile.js'&gt;",
        "&lt;script href='myfile.js'&gt;",
      ],
    },
    {
      question: "How do you write 'Hello World' in an alert box?",
      answer: "alert('Hello World')",
      options: ["msg('Hello World'", "alertBox('Hello World')"],
    },
  ],
};

const ids = {
  HTML: "3b5239ae-a885-45e7-8d7f-1d582f9ef07c",
  Css: "913361f2-e485-43a3-8617-bf7f00380977",
  Javascript: "b8a5ec3d-fd27-4b50-8413-dce803363d65",
};
const q_id = {
  "What does HTML stand for?": "c49ca31a-4598-4193-959f-8147cfd83ee2",
  "Extra question": "5264c294-dfe1-4ab8-8335-872882b49655",
  "What is the correct HTML element for inserting a line break?":
    "54894a62-2760-4a69-be93-d47e42ae3ef5",
  "What is the correct HTML element to define emphasized text?":
    "df714df0-8251-4d1c-8248-5a85f44d0c43",
  "What is the correct Javascript syntax to change the content of the HTML element below? <br> &lt;p id='demo'&gt;Change Me!&lt;/p&gt;":
    "bde1edc8-1a1f-4df2-b1c2-36a425b92de9",
  "Where is the correct place to insert a Javascript?":
    "e11de7bd-79e9-42cb-b4f1-ec6ed87c6435",
  "Inside which HTML element do we put the Javascript?":
    "bdcfe5d5-10aa-48f1-bf87-7b02d8bbcc1b",
  "Which HTML element is used to specify a footer for a document or section?":
    "00088120-9dc5-4ce8-a24f-8a45665c5cd7",
  "What is the correct syntax for referring to an external script called 'myfile.js'":
    "83548692-e2c3-4ca6-8435-c994c8703657",
  "Choose the correct HTML element for the largest heading":
    "d8002302-df5f-4172-bb7a-69fc65b2ef22",
  "How do you write 'Hello World' in an alert box?":
    "28d828e2-f6e0-4f5f-aee7-e571fd6f4cf6",
  "What is the correct HTML for referring to an external style sheet?":
    "c6729910-1b77-4833-9143-9cda15cef7b4",
  "How do you insert a comment in a CSS file?":
    "18a492d1-37d1-49c1-925c-0bf8a1b1e98f",
  "What does CSS stand for?": "ca956ab0-626e-4fac-b566-f32addc3613c",
  "Where in an HTML document is the correct place to refer to an external style sheet?":
    "e8e693b3-4913-4438-8d93-35cd5737af8d",
  "Which HTML tag is used to define an internal style sheet?":
    "cea5cf38-e70b-4fad-9a1f-7702fe8ffbd1",
};

export { accounts, quiz, ids, q_id };
