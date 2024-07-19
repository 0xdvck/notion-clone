# Notion Database Clone Application

## Description

A implementation of Momos's challenge.

## Prerequisites

- [Docker] https://github.com/docker lastest

## Setup

### Docker

1. Clone or download this repository to your local machine, then extract and open the folder.
2. Run `docker compose up` to install deploy application.
3. Access the UI with default domain `localhost:80`

## Task List

- [ ] Implement a basic given a Notion database as input

  - [x] Implement basic table view
    - [x] Comlumn heading drag & drop
    - [x] Resize columns
  - [x] Implement basic sort panel
  - [ ] Implement basic filter panel

- [x] Implement sort/filter logic
  - [x] Implement sorting **on client side** - details below
  - [x] Implement filtering **on client side** - details below
    - [x] Implement compound filter condition
    - [x] Implement `NOT` condition with `nor` and `nand` datatype
- [ ] Implement test for filter logic
  - [ ] test for compound filter
  - [ ] test for `NOT` condition
- [x] Dockerize project

## Implementation Detail

### Sort

- All the sort data are store in redux.
- When there is a new sort the `query` will re-calculate and apply sort `query`
  to the main data.
- Detail about sort implementation is at `app/src/utils/sort.ts` file.

##### Example Sort Feature Data Structure

```
    sort: {
        data: {
            [id]: {property: 'Tags', direction: 'dsc'}
        },
        query: [{property: 'Tags', direction: 'dsc'}]
    }
```

### Filter

- All the filter data are store in redux
- When there is new filter the `query` will re-calculate and apply filter `query`
  to the main data.
- `NOT` logic will be handle with new `nor` and `nand` condition
- Detail about filter implementation is at `app/src/utils/filter.ts` file.

##### Example Filter Feature Data Structure

```
    filter: {
        error: string,
        data: {
            0: {
                id: 0,
                children: [1,2],
                type: 'group',
                condition: 'and'
            },
            1: {
                id: 1,
                type: 'simple',
                query: {
                    property: 'Done',
                    checkbox: {
                       equals: true
                    }
                }
            },
            2: {
                id: 0,
                children: [3,4],
                type: 'group',
                condition: 'nor' // using nor for NOT logic
            }
            3: {
                id: 3,
                type: 'simple',
                query: {
                    property: 'Tags',
                    contains: 'A'
                }
            }
            4: {
                id: 4,
                type: 'simple',
                query: {
                    property: 'Tags',
                    contains: 'B'
                }
            }
        }
        query: {
            and: [
            {
                    property: 'Done',
                    checkbox: {
                       equals: true
                    }
                },
            {
                or: [
                {
                    property: 'Tags',
                    does_not_contain: "A"
                },
                {
                    property: 'Tags',
                    does_not_contain: "B"
                }
              ]
            }
           ]
        }
    }
```

## FAQ

### Why i implement filter/sort from sratch?

Because i didn't read the requirement careful enough.
