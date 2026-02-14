import { Grid, Col } from 'rsuite';
import { Header, Content, Footer, } from 'rsuite'
import AppointmentForm from './AppointmentForm';
import AppointmentList from './AppointmentList';
import Dashboard from './TDashboard';

function Teacher() {
  return ( 
    <div>
      <Grid>
      <Header>
      <Col xs={24} sm={12} md={8}>
        <AppointmentForm />
      </Col>
      </Header>
      <Content>
        <AppointmentList />
      </Content>
      <Footer>
        <Dashboard />
      </Footer>
    </Grid>
    </div>
    );
}
export default Teacher;
