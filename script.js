$(document).ready(function () {

    /* ------------------ LOCAL STORAGE ------------------ */
    function saveTasks() {
        const tasks = [];
        $("#todoList li .item-text").each(function () {
            tasks.push($(this).text());
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addItem(task));
    }

    /* ------------------ INIT ------------------ */
    $("#todoList").sortable({
        update: function () {
            saveTasks();
        }
    });

    loadTasks();

    /* ------------------ AUTO-RESIZE TEXTAREA ------------------ */
    const textarea = document.getElementById('addInput');
    textarea.addEventListener('input', () => {
        textarea.style.height = 'auto';
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    /* ------------------ ADD ITEM ------------------ */
    $("#addBtn").click(function () {
        const text = $("#addInput").val().trim();
        if (text === "") return alert("Please enter a task");

        addItem(text);
        saveTasks();

        // Reset textarea
        $("#addInput").val('');
        textarea.style.height = '2.5rem';
    });

    function addItem(text) {
        $("#todoList").append(`
            <li>
                <span class="item-text">${text}</span>
                <span>
                    <button class="editBtn">Edit</button>
                    <button class="deleteBtn">Delete</button>
                </span>
            </li>
        `);
    }

    /* ------------------ DELETE ------------------ */
    $("#todoList").on("click", ".deleteBtn", function () {
        $(this).closest("li").remove();
        saveTasks();
    });

    /* ------------------ EDIT ------------------ */
    $("#todoList").on("click", ".editBtn", function () {
        const li = $(this).closest("li");
        const text = li.find(".item-text").text();

        const newText = prompt("Edit task:", text);
        if (newText && newText.trim() !== "") {
            li.find(".item-text").text(newText);
            saveTasks();
        }
    });

    /* ------------------ SEARCH ------------------ */
    $("#search").on("keyup", function () {
        const value = $(this).val().toLowerCase();

        $("#todoList li").each(function () {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(value));
        });
    });
});
