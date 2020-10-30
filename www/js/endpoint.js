function OnAgentConnect()
{
  let cmd = {};
  cmd.app = 'os';
  cmd.req = 'get-directory-list';

  Agents[0].send(cmd);
}

function OnAgentMessage(res) 
{

}

function InitEndpoint()
{
  Agents[0]['onconnect'] = OnAgentConnect;
  Agents[0]['onmessage']['os'] = OnAgentMessage;
  Agents[0]['onmessage']['br'] = OnAgentMessage;
}

windowOnLoadCbk.push(InitEndpoint);