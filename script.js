// =========================================
// EXPENSE TRACKER V2
// PART 1
// =========================================

// -----------------------------
// Load Expenses
// -----------------------------

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Charts

let pieChart;
let barChart;

// -----------------------------
// Add Expense
// -----------------------------

function addExpense(){

    const name =
    document.getElementById("expenseName").value.trim();

    const amount =
    Number(document.getElementById("expenseAmount").value);

    const category =
    document.getElementById("expenseCategory").value;

    const date =
    document.getElementById("expenseDate").value;

    if(name==="" || amount<=0 || date===""){

        alert("Please fill all fields.");

        return;

    }

    const expense={

        id:Date.now(),

        name:name,

        amount:amount,

        category:category,

        date:date

    };

    expenses.push(expense);

    saveExpenses();

    clearInputs();

    refreshDashboard();

}

// -----------------------------
// Save
// -----------------------------

function saveExpenses(){

    localStorage.setItem(

        "expenses",

        JSON.stringify(expenses)

    );

}

// -----------------------------
// Clear Inputs
// -----------------------------

function clearInputs(){

    document.getElementById("expenseName").value="";

    document.getElementById("expenseAmount").value="";

    document.getElementById("expenseCategory").value="Food";

    document.getElementById("expenseDate").valueAsDate=new Date();

}

// -----------------------------
// Delete Expense
// -----------------------------

function deleteExpense(id){

    expenses=

    expenses.filter(

        expense=>expense.id!==id

    );

    saveExpenses();

    refreshDashboard();

}

// -----------------------------
// Clear All Expenses
// -----------------------------

document

.getElementById("clearAllBtn")

.addEventListener(

"click",

function(){

    const confirmDelete=

    confirm(

"Delete ALL expenses?"

    );

    if(confirmDelete){

        expenses=[];

        saveExpenses();

        refreshDashboard();

    }

}

);

// -----------------------------
// Dark Mode
// -----------------------------

const darkBtn=

document.getElementById(

"darkModeBtn"

);

darkBtn.addEventListener(

"click",

function(){

document.body.classList.toggle(

"dark"

);

if(

document.body.classList.contains(

"dark"

)

){

darkBtn.innerHTML=

'<i class="fa-solid fa-sun"></i>';

}

else{

darkBtn.innerHTML=

'<i class="fa-solid fa-moon"></i>';

}

}

);

// -----------------------------
// Auto Today's Date
// -----------------------------

document

.getElementById(

"expenseDate"

)

.valueAsDate=new Date();

// -----------------------------
// Filter Events
// -----------------------------

document

.getElementById(

"searchBox"

)

.addEventListener(

"keyup",

refreshDashboard

);

document

.getElementById(

"filterCategory"

)

.addEventListener(

"change",

refreshDashboard

);

document

.getElementById(

"filterPeriod"

)

.addEventListener(

"change",

function(){

const period=

this.value;

const custom=

document.getElementById(

"customMonthContainer"

);

if(period==="custom"){

custom.style.display="block";

}

else{

custom.style.display="none";

}

refreshDashboard();

}

);

document

.getElementById(

"customMonth"

)

.addEventListener(

"change",

refreshDashboard

);
// =========================================
// PART 2
// Dashboard Refresh & Filtering
// =========================================

function refreshDashboard(){

    const filteredExpenses = getFilteredExpenses();

    displayExpenses(filteredExpenses);

    updateSummaryCards(filteredExpenses);

    updateCategorySummary(filteredExpenses);

    updateQuickStats(filteredExpenses);

    updateInsights(filteredExpenses);

    updateCharts(filteredExpenses);

}

// =========================================
// FILTERING
// =========================================

function getFilteredExpenses(){

    const category =
    document.getElementById("filterCategory").value;

    const search =
    document.getElementById("searchBox")
    .value
    .toLowerCase();

    const period =
    document.getElementById("filterPeriod").value;

    const customMonth =
    Number(document.getElementById("customMonth").value);

    const today = new Date();

    let filtered = expenses.filter(expense=>{

        const expenseDate = new Date(expense.date);

        let periodMatch = false;

        switch(period){

            case "current":

                periodMatch =
                expenseDate.getMonth()===today.getMonth()
                &&
                expenseDate.getFullYear()===today.getFullYear();

                break;

            case "last":

                const lastMonth = new Date(
                    today.getFullYear(),
                    today.getMonth()-1,
                    1
                );

                periodMatch =
                expenseDate.getMonth()===lastMonth.getMonth()
                &&
                expenseDate.getFullYear()===lastMonth.getFullYear();

                break;

            case "3months":

                const threeMonthsAgo = new Date(
                    today.getFullYear(),
                    today.getMonth()-2,
                    1
                );

                periodMatch =
                expenseDate>=threeMonthsAgo;

                break;

            case "6months":

                const sixMonthsAgo = new Date(
                    today.getFullYear(),
                    today.getMonth()-5,
                    1
                );

                periodMatch =
                expenseDate>=sixMonthsAgo;

                break;

            case "year":

                periodMatch =
                expenseDate.getFullYear()===today.getFullYear();

                break;

            case "all":

                periodMatch = true;

                break;

            case "custom":

                periodMatch =
                expenseDate.getMonth()===customMonth;

                break;

        }

        const categoryMatch =
        category==="All"
        ||
        expense.category===category;

        const searchMatch =
        expense.name
        .toLowerCase()
        .includes(search);

        return (
            periodMatch
            &&
            categoryMatch
            &&
            searchMatch
        );

    });

    updateCurrentView(period);

    return filtered;

}

// =========================================
// VIEW LABEL
// =========================================

function updateCurrentView(period){

    let text="";

    switch(period){

        case "current":

            text="Viewing : Current Month";

            break;

        case "last":

            text="Viewing : Last Month";

            break;

        case "3months":

            text="Viewing : Last 3 Months";

            break;

        case "6months":

            text="Viewing : Last 6 Months";

            break;

        case "year":

            text="Viewing : This Year";

            break;

        case "all":

            text="Viewing : All Time";

            break;

        case "custom":

            const month =
            document
            .getElementById("customMonth")
            .options[
            document
            .getElementById("customMonth")
            .selectedIndex
            ].text;

            text="Viewing : "+month;

            break;

    }

    document.getElementById(
        "currentView"
    ).innerHTML=text;

    document.getElementById(
        "selectedPeriod"
    ).innerHTML=text.replace("Viewing : ","");

}

// =========================================
// DISPLAY EXPENSES
// =========================================

function displayExpenses(filtered){

    const list =
    document.getElementById("expenseList");

    list.innerHTML="";

    filtered
    .sort(
        (a,b)=>
        new Date(b.date)-new Date(a.date)
    );

    filtered.forEach(expense=>{

        const card =
        document.createElement("div");

        card.className="expense-item";

        card.innerHTML=`

        <div class="expense-details">

            <h3>${expense.name}</h3>

            <p>${expense.category}</p>

            <small>${expense.date}</small>

        </div>

        <div>

            <h3>

            ₹${expense.amount.toLocaleString()}

            </h3>

            <button

            class="delete-btn"

            onclick="deleteExpense(${expense.id})">

            Delete

            </button>

        </div>

        `;

        list.appendChild(card);

    });

}
// =========================================
// PART 3
// SUMMARY CARDS
// QUICK STATS
// CATEGORY SUMMARY
// INSIGHTS
// =========================================

// -----------------------------
// Summary Cards
// -----------------------------

function updateSummaryCards(filtered){

    let food=0;
    let travel=0;
    let shopping=0;
    let others=0;
    let total=0;

    filtered.forEach(expense=>{

        total+=expense.amount;

        switch(expense.category){

            case "Food":
                food+=expense.amount;
                break;

            case "Travel":
                travel+=expense.amount;
                break;

            case "Shopping":
                shopping+=expense.amount;
                break;

            default:
                others+=expense.amount;

        }

    });

    document.getElementById("total").innerHTML =
        "₹"+total.toLocaleString();

    document.getElementById("foodCard").innerHTML =
        "₹"+food.toLocaleString();

    document.getElementById("travelCard").innerHTML =
        "₹"+travel.toLocaleString();

    document.getElementById("shoppingCard").innerHTML =
        "₹"+shopping.toLocaleString();

    document.getElementById("othersCard").innerHTML =
        "₹"+others.toLocaleString();

}

// -----------------------------
// Category Summary
// -----------------------------

function updateCategorySummary(filtered){

    let food=0;
    let travel=0;
    let shopping=0;
    let others=0;

    filtered.forEach(expense=>{

        switch(expense.category){

            case "Food":
                food+=expense.amount;
                break;

            case "Travel":
                travel+=expense.amount;
                break;

            case "Shopping":
                shopping+=expense.amount;
                break;

            default:
                others+=expense.amount;

        }

    });

    document.getElementById("foodTotal").innerHTML =
        "₹"+food.toLocaleString();

    document.getElementById("travelTotal").innerHTML =
        "₹"+travel.toLocaleString();

    document.getElementById("shoppingTotal").innerHTML =
        "₹"+shopping.toLocaleString();

    document.getElementById("othersTotal").innerHTML =
        "₹"+others.toLocaleString();

}

// -----------------------------
// Quick Stats
// -----------------------------

function updateQuickStats(filtered){

    document.getElementById(
        "transactionCount"
    ).innerHTML = filtered.length;

    const totals = {

        Food:0,
        Travel:0,
        Shopping:0,
        Others:0

    };

    filtered.forEach(expense=>{

        totals[expense.category]+=expense.amount;

    });

    let highestCategory="None";
    let highestAmount=0;

    for(const category in totals){

        if(totals[category]>highestAmount){

            highestAmount=totals[category];
            highestCategory=category;

        }

    }

    document.getElementById(
        "highestCategory"
    ).innerHTML = highestCategory;

}

// -----------------------------
// Monthly Insights
// -----------------------------

function updateInsights(filtered){

    const insight =

    document.getElementById(
        "insightText"
    );

    if(filtered.length===0){

        insight.innerHTML =

        "No expenses found for the selected filters.";

        return;

    }

    let total=0;

    let food=0;
    let travel=0;
    let shopping=0;
    let others=0;

    filtered.forEach(expense=>{

        total+=expense.amount;

        switch(expense.category){

            case "Food":
                food+=expense.amount;
                break;

            case "Travel":
                travel+=expense.amount;
                break;

            case "Shopping":
                shopping+=expense.amount;
                break;

            default:
                others+=expense.amount;

        }

    });

    const categoryTotals={

        Food:food,
        Travel:travel,
        Shopping:shopping,
        Others:others

    };

    let highestCategory="Food";
    let highestAmount=food;

    for(const category in categoryTotals){

        if(categoryTotals[category]>highestAmount){

            highestAmount=
            categoryTotals[category];

            highestCategory=
            category;

        }

    }

    const average=

    Math.round(total/filtered.length);

    insight.innerHTML =

    `
    You have recorded
    <strong>${filtered.length}</strong>
    transactions.

    Your total spending is
    <strong>₹${total.toLocaleString()}</strong>.

    Your highest spending category is
    <strong>${highestCategory}</strong>.

    Your average expense per transaction is
    <strong>₹${average.toLocaleString()}</strong>.
    `;

}
// =========================================
// PART 4
// CHARTS
// INITIAL LOAD
// =========================================

// -----------------------------
// Charts
// -----------------------------

function updateCharts(filtered){

    let food = 0;
    let travel = 0;
    let shopping = 0;
    let others = 0;

    // Monthly totals
    let monthlyTotals = new Array(12).fill(0);

    filtered.forEach(expense=>{

        switch(expense.category){

            case "Food":
                food += expense.amount;
                break;

            case "Travel":
                travel += expense.amount;
                break;

            case "Shopping":
                shopping += expense.amount;
                break;

            default:
                others += expense.amount;

        }

        const month =
        new Date(expense.date).getMonth();

        monthlyTotals[month] += expense.amount;

    });

    // Destroy old charts

    if(pieChart){

        pieChart.destroy();

    }

    if(barChart){

        barChart.destroy();

    }

    // -----------------------------
    // Pie Chart
    // -----------------------------

    pieChart = new Chart(

        document.getElementById("pieChart"),

        {

            type:"pie",

            data:{

                labels:[
                    "Food",
                    "Travel",
                    "Shopping",
                    "Others"
                ],

                datasets:[{

                    data:[
                        food,
                        travel,
                        shopping,
                        others
                    ],

                    backgroundColor:[

                        "#ff8c42",
                        "#00b4d8",
                        "#ff4d6d",
                        "#43aa8b"

                    ],

                    borderWidth:2

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        position:"bottom"

                    }

                }

            }

        }

    );

    // -----------------------------
    // Monthly Spending Trend
    // -----------------------------

    barChart = new Chart(

        document.getElementById("barChart"),

        {

            type:"bar",

            data:{

                labels:[

                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec"

                ],

                datasets:[{

                    label:"Monthly Spending",

                    data:monthlyTotals,

                    backgroundColor:"#4f46e5",

                    borderRadius:8

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        display:false

                    }

                },

                scales:{

                    y:{

                        beginAtZero:true

                    }

                }

            }

        }

    );

}

// =========================================
// INITIAL LOAD
// =========================================

// Auto today's date

document.getElementById(
    "expenseDate"
).valueAsDate = new Date();

// First dashboard load

refreshDashboard();