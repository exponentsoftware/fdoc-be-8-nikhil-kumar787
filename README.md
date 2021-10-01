# Backend Assignment

## TODO with comments and Tags

- Add 2 new schemas

  One for Comments:
  - text
  - created_at
  - updated_at
  - posted_by (user_id)
  - You can create flat comments or nested comments

  Another for Tags:
  - title
  - created_at
  - updated_at
  - category

- Every TODO list can have multiple comments
- Every Tag can be part of multiple TODO list and every TODO list can have multiple tags
- Create APIs for Adding/Updating/Reading Comments on a TODO list
- Delete and Update comment should only be allowed for Admin Users or for the user who added the comments
- Create APIs for Adding/Updating Tags and on a TODO list
- Delete and Update tags should only be allowed for Admin Users
- Users can add Tags, update tags on their own TODO list
- Update API for TODO list to send comments and tags

### Prefered Technologies

| Environment  | Framework  |
|--------------|------------|
| Backend APIs | Express Js |
| Database     | Postgres   |
| ORM/ODM      | Sequelize  |
