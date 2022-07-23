import { useParams } from "react-router-dom"
export default function ContainerTerminal(props){
    props.setVisible(false);
    const { name,namespace,container } = useParams();
    console.log(name,namespace,container);
    return(
        <>
            <h1>{name}</h1>
        </>
    )
}