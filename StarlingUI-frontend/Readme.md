# CSS will be done at the last stage

The codes focus on React fuctions.

# Project API SPEC

{
    id: 1,
    name: 'Project A',
    dateModified: '2022-06-05 00:00:00',
    lastModifiedBy: 1,
    saved: true,
    ownerID: 1,
    memberIDs: [1],
    masterNode: {
      id: 1000,
      name: 'masterA',
      images:[
        {
          id:1,
          name:'image1'
        }
      ]
      ,
      deployedDrones:[
        {
          id:1,
          name:'drone1'
        }
      ]
    },
    workingNodes:[
      {
        id:1,
        name: 'node1',
        images:[
          {
            id:1,
            name:'image1'
          },
          {
            id:2,
            name:'image2'
          }
        ],
        deployedDrones:[
          {
            id:2,
            name:'drone2'
          },
          {
            id:3,
            name:'drone3'
          },
        ]
      },
      {
        id:2,
        name: 'node2',
        images:[
          {
            id:2,
            name:'image2'
          }
        ],
        deployedDrones:[
          {
            id:2,
            name:'drone2'
          },
          {
            id:3,
            name:'drone3'
          },
        ]
      },
    ]
  }
