import React, { useEffect, useState } from "react";
import {
  getListOfTeams,
  getSpecificTeamDetails,
  getSpecificTeamGameDetails,
} from "../Services/app-service";
import DataTable from "react-data-table-component";
import Offcanvas from "react-bootstrap/Offcanvas";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { formatDate } from "../Services/utility";

export const TeamList = () => {
  const [teamList, setTeamList] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredList, setfilteredList] = useState([]);
  const [show, setShow] = useState(false);
  const [teamDetails, setTeamDetails] = useState({});
  const [homeTeamName, setHomeTeamName] = useState("");
  const [visitorTeamName, setVisitorTeamName] = useState("");
  const [randomGameDetails, setRandomGameDetails] = useState({});
  const [totalGameCount, setTotalGameCount] = useState(0);

  useEffect(() => {
    fetchAllTeams();
  }, []);

  useEffect(() => {
    const result = teamList.filter((list) => {
      return list.name.toLowerCase().match(search.toLowerCase());
    });
    setfilteredList(result);
  }, [search]);

  const handleClose = () => setShow(false);

  const handleShow = (id) => {
    setShow(true);
    fetchSpecificTeamDetails(id);
  };

  const fetchAllTeams = async () => {
    try {
      const response = await getListOfTeams();
      setTeamList(response.data);
      setfilteredList(response.data);
    } catch (error) {}
  };

  const fetchSpecificTeamDetails = async (id) => {
    try {
      const response = await getSpecificTeamDetails(id);
      if (response.data) {
        setTeamDetails(response.data);
        fetchSpecificTeamGameDetails(id);
      }
    } catch (error) {}
  };

  const fetchSpecificTeamGameDetails = async (id) => {
    const sessionValue = 2021;
    try {
      const response = await getSpecificTeamGameDetails(sessionValue, id);
      if (response.meta.total_count) {
        setTotalGameCount(response.meta.total_count);
        const randomNumber = Math.floor(Math.random() * response.data.length);
        setRandomGameDetails(response.data[randomNumber]);
        setHomeTeamName(randomGameDetails.home_team.name);
        setVisitorTeamName(randomGameDetails.visitor_team.name);

        console.log("randomGameDetails", randomGameDetails);
      }
    } catch (error) {}
  };

  const columns = [
    {
      name: "Team Name",
      selector: (row) => row.name,
    },
    {
      name: "City",
      selector: (row) => row.city,
      sortable: true,
    },
    {
      name: "Abbreviation",
      selector: (row) => row.abbreviation,
    },
    {
      name: "Conference",
      selector: (row) => row.conference,
    },
    {
      name: "Division",
      selector: (row) => row.division,
    },
  ];
  const headerStyle = {
    backgroundColor: "#F2F2F2",
  };
  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#074684",
        color: "white",
      },
    },
    table: {
      style: {
        marginLeft: "22px",
      },
    },
    header: {
      style: {
        fontSize: "25px",
      },
    },
  };

  return (
    <>
      <DataTable
        title="NBA TEAMS"
        columns={columns}
        data={filteredList}
        fixedHeader
        pagination
        fixedHeaderScrollHeight="450px"
        selectableRowsSingle
        selectableRowsHighlight
        highlightOnHover
        customStyles={customStyles}
        subHeaderAlign="left"
        subHeader
        onRowClicked={(row) => handleShow(row.id)}
        row
        subHeaderComponent={
          <input
            type="text"
            placeholder="Search here"
            className="form-control w-25"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
      />
      <Offcanvas placement="end" show={show} onHide={handleClose}>
        <Offcanvas.Header style={headerStyle} closeButton>
          <Offcanvas.Title>{teamDetails.full_name}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Container>
            <Row className="mb-2">
              <Col xs={8} md={8}>
                Team Full Name
              </Col>
              <Col xs={8} md={4}>
                {teamDetails.full_name}
              </Col>
            </Row>
            <Row>
              <Col xs={8} md={8}>
                Total Games in 2021
              </Col>
              <Col xs={8} md={4}>
                {totalGameCount}
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <Col className="fw-bold mt-4 mb-3">Random Game Details:</Col>
            </Row>
            <Row className="fw-bold my-3">
              <Col xs={8} md={8}>
                Date
              </Col>
              <Col xs={8} md={4}>
                {formatDate(randomGameDetails.date, "MM-DD-YYYY")}
              </Col>
            </Row>
            <Row className="fw-bold my-3">
              <Col xs={8} md={8}>
                Home Team
              </Col>
              <Col xs={8} md={4}>
                {homeTeamName}
              </Col>
            </Row>
            <Row className="fw-bold my-3">
              <Col xs={8} md={8}>
                Home Team Score
              </Col>
              <Col xs={8} md={4}>
                {randomGameDetails.home_team_score}
              </Col>
            </Row>
            <Row className="fw-bold my-3">
              <Col xs={8} md={8}>
                Visitor Team
              </Col>
              <Col xs={8} md={4}>
                {visitorTeamName}
              </Col>
            </Row>
            <Row className="fw-bold my-3">
              <Col xs={8} md={8}>
                Visitor Team Score
              </Col>
              <Col xs={8} md={4}>
                hello
              </Col>
            </Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};
