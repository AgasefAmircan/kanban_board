# Kanban Board

TaskFlow is a clean, intuitive, and responsive Kanban board application built with HTML, SCSS, and vanilla JavaScript. It allows you to manage your tasks efficiently by organizing them into "To Do", "In Progress", and "Done" columns. All task data is persistently stored in your browser's local storage.

## Features

*   **Task Management:** Create, edit, and delete tasks through a user-friendly modal.
*   **Drag & Drop:** Easily move tasks between the "To Do", "In Progress", and "Done" columns.
*   **Task Properties:** Assign a title, description, priority (Low, Medium, High), and a due date to each task.
*   **Filtering & Sorting:**
    *   Search for tasks by their title.
    *   Filter tasks by priority level.
    *   Sort tasks by due date (ascending or descending).
*   **Data Persistence:** Tasks are automatically saved to the browser's `localStorage`, so your board state is preserved across sessions.
*   **Visual Indicators:**
    *   Priority levels are color-coded for quick identification.
    *   Overdue tasks are highlighted to draw attention.
    *   Task counters for each column show the number of tasks at a glance.
*   **Responsive Design:** The layout adapts to different screen sizes, making it usable on both desktop and mobile devices.

## Technologies Used

*   **HTML5:** The core structure of the web page.
*   **SCSS:** For modular and maintainable styling, compiled to CSS.
*   **JavaScript (ES6+):** Handles all the application logic, including task manipulation, DOM updates, drag-and-drop functionality, and local storage integration.
*   **Font Awesome:** For icons used throughout the interface.

## Getting Started

To run this project locally, simply follow these steps:

1.  Clone the repository to your local machine:
    ```bash
    git clone https://github.com/agasefamircan/kanban_board.git
    ```
2.  Navigate to the project directory:
    ```bash
    cd kanban_board
    ```
3.  Open the `index.html` file in your favorite web browser.

That's it! You can now start adding and managing your tasks.

## How to Use

*   **Add a Task:** Click the "Add Task" button in the header to open the modal. Fill in the details and click "Save Task".
*   **Move a Task:** Click and drag a task card from one column and drop it into another.
*   **Edit a Task:** Hover over a task card and click the pencil icon. The modal will open with the task's current details for you to edit.
*   **Delete a Task:** Hover over a task card and click the trash can icon.
*   **Filter & Sort:** Use the search bar and dropdown menus in the header to filter and sort the displayed tasks.