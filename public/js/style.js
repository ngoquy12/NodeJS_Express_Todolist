const per_page = new URLSearchParams(window.location.search).get('per_page');

fetch("/api/v1/todos")
    .then((response) => response.json())
    .then((data) => {
        let result = "";
        let countPending = 0;
        let todos = data.data;

        if (per_page) {
            todos = todos.slice(0, +per_page);
        }
        for (let index = 0; index < todos.length; index++) {
            if (todos[index].completed == false) countPending++
            result += `
        <tr style="width:100%">
          <td 
            style="${todos[index].completed ? 'text-decoration: line-through' : ''};width:80%;text-align:left; padding:0px 30px;"
            id="todoTitle_${index}"
          >
            ${todos[index].title}
          </td>
          <td style="width:10%"><button class="handleButton" onclick="handleDelete(${todos[index].id})">Delete</button></td>
          <td style="width:10%"><button class="handleButton" onclick="handleUpdate(${todos[index].id})">
          ${todos[index].completed ? "Undo" : "Completed"}
          </button></td>
        </tr>
      `;
        }

        document.getElementById("todoLists").innerHTML = result;
        document.getElementById("pending").innerHTML = `You have ${countPending} pending tasks`
    });


function handleAdd(e) {
    e.preventDefault();
    let title = document.getElementById("title").value;
    if (!title) {
        alert("Input blank")
    } else {
        fetch("/api/v1/todos")
            .then((response) => response.json())
            .then((data) => {
                let todos = data.data;
                let isExist = todos.find(item => item.title == title)
                if (isExist) {
                    alert("Todo exist")
                } else {
                    fetch("/api/v1/todos", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: title }),
                    })
                        .then(response => {
                            // Kiểm tra nếu yêu cầu thành công
                            if (response.ok) {
                                // Chuyển hướng đến trang "/"
                                window.location.href = "/";
                            } else {
                                console.log("error");
                            }
                        })
                        .catch(error => {
                            // Xử lý lỗi nếu cần
                        });
                }
            })

    }

}


function handleDelete(id) {
console.log("123");
    fetch(`/api/v1/todos/${id}`, {
        method: "DELETE",
    })
        .then(response => {
            console.log(response);
            window.location.href = "/"
        })
        .catch(error => {
            console.error(error);
        });
}

function handleDeleteAll(params) {
    fetch(`/api/v1/todos`, {
        method: "DELETE",
    })
        .then(response => {
            console.log(response);
            window.location.href = "/"
        })
        .catch(error => {
            console.error(error);
        });
}

function handleUpdate(id) {
    fetch(`/api/v1/todos/${id}`, {
        method: "PUT",
    })
        .then(response => {
            console.log(response);
            window.location.href = "/"
        })
        .catch(error => {
            console.error(error);
        });

}

