export const welcomeMessage = (name) => {
  return {
    type: "list",
    body: {
      text: `Dear ${name},

Welcome to EliteAddy Inc.
Customer Support, How may I assist you today
      `,
    },
    action: {
      button: "Menus",
      sections: [
        {
          title: "Our Services",
          rows: [
            {
              id: "webdev",
              title: "Web Development",
            },
            {
              id: "appdev",
              title: "App Development",
            },
            {
              id: "digitalmarketing",
              title: "Digital Marketing",
            },
            {
              id: "graphicdesign",
              title: "Graphic Design",
            },
          ],
        },
      ],
    },
  };
};

export const webDevMessage = () => {
  return {
    type: "list",
    header: {
      type: "text",
      text: "You selected our Web Development Service",
    },
    body: {
      text: "Please select the type of web development service you need",
    },
    action: {
      button: "Lists",
      sections: [
        {
          title: "Web Development",
          rows: [
            {
              id: "frontend",
              title: "Frontend Development",
            },
            {
              id: "backend",
              title: "Backend Development",
            },
            {
              id: "fullstack",
              title: "Fullstack Development",
            },
          ],
        },
      ],
    },
  };
};

export const formLinkMessage = (service, from) => {
  return {
    name: "menutesttemplate",
    language: {
      code: "en_GB",
    },
    components: [
      {
        type: "body",
        parameters: [
          {
            type: "text",
            text: service,
          },
        ],
      },
      {
        type: "button",
        sub_type: "url",
        index: "0",
        parameters: [
          {
            type: "text",
            text: JSON.stringify(from),
          },
        ],
      },
    ],
  };
};

export const thankYouMessage = (name) => {
  return {
    body: `Thank you ${name} for contacting us, our agent will get in touch with you`,
  };
};
