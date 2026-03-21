import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import type { ReactNode } from "react";

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

export function PageContainer({ title, children }: PageContainerProps) {
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>
        {title}
      </Typography>
      <Box>{children}</Box>
    </Container>
  );
}
