import React from 'react'
import MonitorNode from './monitor-contianer/MonitorNode';
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';



export default function Monitor() {

    const [data, setData] = useState(null);
    const [projects, setProjects] = useState(null);
    const [state, setstate] = useState(200);
    const [namespace, setNamespace] = useState('');
    const [open, setOpen] = useState(false);

    const getNodeStatus = () => {
        axios.get('http://localhost:8080/monitor/nodes')
            .then(function (response) {
                setData(response.data);
                setstate(response.status);
                console.log(response.data);

            })
            .catch(function (error) {
                setstate(error.response.data.status);
                console.log(error);
                console.log(error.response.data.status);

            });

    }

    const getK8sData = () => {
        function getNodes() {
            return axios.get('http://localhost:8080/monitor/nodes');
        }

        function getNameSpaces() {
            return axios.get('http://localhost:8080/monitor/namespace');
        }

        Promise.all([getNodes(), getNameSpaces()])
            .then(function (results) {
                const acct = results[0];
                const perm = results[1];
                setData(acct.data);
                setstate(acct.status);
                setProjects(perm.data);
            })
            .catch(function (error) {
                setstate(error.response.status);
                setData(error.response.data);
                console.log(error.response.status);
                
            });
    }

    
    const listItems = projects?.map((project) =>
    <MenuItem value={project} key={projects.indexOf(project)}>{project}</MenuItem>
    );

    useEffect(() => {
        getK8sData();
        const interval = setInterval(
            () => { getK8sData(); }, 30000
        )
        return () => clearInterval(interval)
    }, []);

    const handleChange = (event) => {
        setNamespace(event.target.value);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };


    function showData() {
        if (state === 200) {
            return (
                <div>

                    <div className='delete'>
                        <Button
                            variant="outlined"
                            startIcon={<DeleteIcon />}
                            onClick={handleOpen}
                            className="delete-popup"
                            style={{
                                color: "white",
                                borderColor: "white",
                                textTransform: "none",
                                fontFamily: "Cambria"
                            }}>
                            Delete Project
                        </Button>
                    </div>

                    <div className="node-container">

                        {data?.map(node => {
                            return <MonitorNode getNodes={getNodeStatus} key={node.id} {...node}></MonitorNode>
                        })}
                    </div>
                    <Dialog
                        disableEscapeKeyDown
                        open={open}
                        onClose={handleClose}
                    >
                        <DialogTitle>Delete Project</DialogTitle>
                        <DialogContent>
                            <FormControl variant="standard" sx={{ m: 1, minWidth: 250 }}>
                                <InputLabel>Project</InputLabel>
                                <Select value={namespace}
                                    onChange={handleChange}
                                    label="namespace"
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    {listItems}
                                </Select>
                            </FormControl>
                        </DialogContent>
                        <DialogActions>
                            <Button
                                onClick={handleClose}
                                style={{
                                    color: "grey"

                                }}>Cancel</Button>
                            <Button onClick={handleClose}>Ok</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        } else if (state === 500) {
            return (
                <>

                    <h1 className='monitor-error'>No cluster found !!!</h1>

                </>
            )
        } else {
            return (
                <>
                    <h1 className='monitor-error'>Fetch failed,Resending request...</h1>
                    <p className='error-message'>error: {data}</p>
                </>
            )
        }
    }

    return (
        <>
            <div className="monitor">
                {showData()}
            </div>
        </>
    );
}
