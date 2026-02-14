import { Grid, Col } from 'rsuite';
import { Header, Content, Footer, } from 'rsuite'
import BookAppointment from './BookAppointment';
import SearchTeacher from './SearchTeacher';
import Dashboard from './SDashboard';

function Student() {
    return (
        <div>
            <Grid>
                <Header>
                    <Col xs={24} sm={12} md={8}>
                        <SearchTeacher />
                    </Col>
                </Header>
                <Content>
                    <BookAppointment />
                </Content>
                <Footer>
                    <Dashboard />
                </Footer>
            </Grid>
        </div>
    );
}
export default Student;