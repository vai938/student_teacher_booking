import { Grid, Col } from 'rsuite';
import { Header, Content, Footer, } from 'rsuite'
import EditComponent from './EditComponent';
import DeleteComponent from './DeleteComponent';
// import './Page.css';
import Get from './Get';
import Main from './Main';
import Dashboard from './Dashboard';

function Page() {
  return ( 
    <div>
      <Grid>
      <Header>
      <Col xs={24} sm={12} md={8}>
        <Main />
      </Col>
      </Header>
      <Content>
        <Get />
      </Content>
      <Footer>
        <Dashboard />
      </Footer>
    </Grid>
    </div>
    );
}
export default Page;