$(document).ready(function () {

    /* ---------- FUNCTIONS ---------- */

    // Add item to list
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

    // Save tasks to localStorage
    function saveTasks() {
        const tasks = [];
        $("#todoList li .item-text").each(function () {
            tasks.push($(this).text());
        });
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }

    // Load tasks from localStorage
    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        tasks.forEach(task => addItem(task));
    }

    // Get tasks from list (for sharing)
    function getTasks() {
        const tasks = [];
        $("#todoList li .item-text").each(function () {
            tasks.push($(this).text());
        });
        return tasks;
    }

    // Load tasks from shared URL
    function loadSharedTasks(tasks) {
        $("#todoList").empty();
        tasks.forEach(task => addItem(task));
    }

    /* ---------- INIT ---------- */

    // Make list sortable
    $("#todoList").sortable({
        update: saveTasks
    });

    // Load tasks from URL if available
    const params = new URLSearchParams(window.location.search);
    if (params.has("tasks")) {
        try {
            const sharedTasks = JSON.parse(decodeURIComponent(params.get("tasks")));
            loadSharedTasks(sharedTasks);
        } catch (e) {
            console.error("Invalid shared tasks in URL");
        }
    } else {
        // Otherwise load from localStorage
        loadTasks();
    }

    /* ---------- AUTO RESIZE INPUT ---------- */
    const addInput = document.getElementById("addInput");
    addInput.addEventListener("input", () => {
        addInput.style.height = "auto";
        addInput.style.height = addInput.scrollHeight + "px";
    });

    /* ---------- ADD ITEM ---------- */
    $("#addBtn").click(function () {
        const text = $("#addInput").val().trim();
        if (!text) return;

        addItem(text);
        saveTasks();

        $("#addInput").val("");
        addInput.style.height = "3rem";
    });

    /* ---------- DELETE ITEM ---------- */
    $("#todoList").on("click", ".deleteBtn", function () {
        $(this).closest("li").remove();
        saveTasks();
    });

    /* ---------- EDIT ITEM ---------- */
    $("#todoList").on("click", ".editBtn", function () {
        const li = $(this).closest("li");
        const oldText = li.find(".item-text").text();
        const newText = prompt("Edit task:", oldText);

        if (newText && newText.trim()) {
            li.find(".item-text").text(newText);
            saveTasks();
        }
    });

    /* ---------- SEARCH ITEM ---------- */
    $("#search").on("keyup", function () {
        const value = $(this).val().toLowerCase();
        $("#todoList li").each(function () {
            $(this).toggle($(this).text().toLowerCase().includes(value));
        });
    });

    /* ---------- SHARE LINK ---------- */
    $("#shareBtn").click(function () {
        const tasks = getTasks();
        const encodedTasks = encodeURIComponent(JSON.stringify(tasks));
        const shareURL = `${window.location.origin}${window.location.pathname}?tasks=${encodedTasks}`;

        $("#shareLink").val(shareURL).select();
        navigator.clipboard.writeText(shareURL);
        alert("Share link copied! Anyone who opens this link will see your list.");
    });

});
