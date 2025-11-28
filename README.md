Todo CRUD module built in React (Vite) with TypeScript, React Query, and Ant Design.
Purpose: demonstrate clean API integration, cache-aware UI updates, and dynamic field handling (Tags).

⭐ What’s Implemented

1. CRUD for Todos

List todos in an Ant Design table

Create / Edit modal with form validation

Delete with confirmation

Toggle completion status via Switch

2. Tag System

Fetched via useQuery(["tags"])

User can create new tags directly inside the Select (mode="tags")

Automatically checks which tags are new and calls createTag

Maps created tag IDs back into the Todo payload (taggs: { tags_id: number }[])

3. React Query Integration

useQuery for todos + tags

useMutation for create/update/delete

invalidateQueries to keep UI always in sync

Error + success toast messages

4. Code Quality

Fully typed (Todo, Tag, TodoInput)

Separated API layer

Form values pre-filled in Edit mode

Simple and readable modal state management

🛠 Tech Used

React (Vite)

TypeScript

React Query

Ant Design

REST API
