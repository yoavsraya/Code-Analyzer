// src/GraphData.js
import jsonData from './GraphData.json';

let Vertices = [];
let Edges = [];
let FolderCounter = 0;
let folderNames = [];
let isContiener = false;
let label;

function SetLabel(name)
{
  if(isContiener == true)
    {
      return name + "(continer)"
    }
    
    return name;
}
function GetFolderIndex(folderName)
{
  let newItem;

  for (let item of folderNames) {
    if (item.Name === folderName)
    {
      newItem = item.Index;
      break;
    }
  }

  newItem = { Name: folderName, Index: ++FolderCounter };
  folderNames.push(newItem);
  return newItem.Index;
}


async function createGraphFromData()
{
 
  jsonData.forEach(vertex =>{
    Vertices.push({Label: vertex.ClassName, FolderIndex: GetFolderIndex(vertex.FolderName) , degree: 0, methods : vertex.Methods})
  })
  console.log(Vertices);
  
  const verticesLookup = [];
  Vertices.forEach((vertex) => {
    verticesLookup.push(vertex.Label)
  });
  console.log(verticesLookup);

  jsonData.forEach(vertex => {
    const inhertageName = vertex.InheritsFrom;
    if(inhertageName != null)
      {
        if(verticesLookup.includes(inhertageName))
        {
          Edges.push({From : vertex.ClassName, To : vertex.InheritsFrom, Label: "heritage"});
        }
      }
      
      vertex.Compositions.forEach(Composition => {
        if(Composition.startsWith("System.Collections.Generic."))
          {
            isContiener = true;
            Composition = Composition.match(/<(.*)>/)[1];
          }

        if(verticesLookup.includes(Composition))
          {
            Edges.push({From : vertex.ClassName, To : Composition , Label: "Composition"})
          }
      })
      
      vertex.CreationObjects.forEach(CreationObject => {
        if(verticesLookup.includes(CreationObject))
        {
          Edges.push({From : vertex.ClassName, To : CreationObject , Label: "Creating"})
        }
      })
      
      vertex.NestedClasses.forEach(NestedClasse => {
        if(verticesLookup.includes(NestedClasse))
          {
            Edges.push({From : vertex.ClassName, To : NestedClasse , Label: "Nested"})
          }
      })

  }); 
  console.log(Edges);

  Edges.forEach(edge => {
      Vertices[edge.From].degree++;
      Vertices[edge.To].degree++;
  })

  console.log(Vertices);
  console.log(Edges);
  return {Vertices, Edges}
}

export default createGraphFromData;
/*
export const graphData = {
  vertices: [
    { id: 'Program' },
    { id: 'TUI' },
    { id: 'Car' },
    { id: 'CarExistException' },
    { id: 'ClientInfo' },
    { id: 'CreatingObject' },
    { id: 'ElectricMotor' },
    { id: 'fillEnergyToMaxException' },
    { id: 'GarageManager' },
    { id: 'GasMotor' },
    { id: 'MotorBike' },
    { id: 'MotorType' },
    { id: 'Track' },
    { id: 'ValueOutOfRangeException' },
    { id: 'Vehicle' },
    { id: 'Wheels' },
  ],
  edges: [
    { from: 'TUI', to: 'GarageManager', label: 'Inherits' },
    { from: 'TUI', to: 'CreatingObject', label: 'Inherits' },
    { from: 'Car', to: 'Vehicle', label: 'Inherits' },
    { from: 'ClientInfo', to: 'Vehicle', label: 'Inherits' },
    { from: 'CreatingObject', to: 'Vehicle', label: 'Inherits' },
    { from: 'CreatingObject', to: 'GarageManager', label: 'Inherits' },
    { from: 'ElectricMotor', to: 'MotorType', label: 'Inherits' },
    { from: 'GarageManager', to: 'ClientInfo', label: 'Inherits' },
    { from: 'GarageManager', to: 'Vehicle', label: 'Inherits' },
    { from: 'GasMotor', to: 'MotorType', label: 'Inherits' },
    { from: 'MotorBike', to: 'Vehicle', label: 'Inherits' },
    { from: 'Track', to: 'Vehicle', label: 'Inherits' },
    { from: 'Vehicle', to: 'MotorType', label: 'Inherits' },
    { from: 'Vehicle', to: 'Wheels', label: 'Inherits' },
  ],
};
*/