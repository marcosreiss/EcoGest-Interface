import React from "react";
import { useNavigate } from "react-router-dom"

import { Grid, Button, Typography } from "@mui/material";

interface HeaderComponetProps {
    title: string;
    addButtonName: string;
    addButtonPath: string;
}

const TableHeaderComponent: React.FC<HeaderComponetProps> = ({title, addButtonName, addButtonPath}) => {

    const navigate = useNavigate();

    const handleNavigation = () => {
        navigate(addButtonPath);
    };

    return (
        <>

            <Grid item xs={6}>
                <Typography variant="h4" sx={{ mb: { xs: 3, md: 2 } }}>
                    {title}
                </Typography>
            </Grid>
            <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                    <Button variant="contained" color="primary" onClick={handleNavigation}>
                        {addButtonName}
                    </Button>
                </Grid>
            </Grid>

        </>
    )
}

export default TableHeaderComponent;