import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import styled from '@emotion/styled';

const HomeContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  padding: 20px;

  @keyframes gradient {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

const DateDisplay = styled.div`
  font-size: 2rem;
  color: white;
  text-align: center;
  padding: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
`;

const Home = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <HomeContainer>
      <DateDisplay>
        {format(currentDate, 'yyyy年MM月dd日 EEEE', { locale: zhCN })}
      </DateDisplay>
    </HomeContainer>
  );
};

export default Home; 