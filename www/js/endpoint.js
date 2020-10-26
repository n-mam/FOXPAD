function InitAgentObjects()
{
  let j = JSON.parse(g_agents);

//   for (let i = 0; i < j.length; i++)
//   {
//     Agents.push(new Agent(j[i]));
//   }

  $("#id-agents-table").table();

  $("#id-agents-table").on("click", "td:not(.check-cell)", function() {
    let e = $(this);
    while (!e.hasClass("check-cell")) {
      e = e.prev();
    }
    alert(e.next().text());
  });
}

windowOnLoadCbk.push(InitAgentObjects);