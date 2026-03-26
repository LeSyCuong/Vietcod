"use client";

import React from "react";
import styled from "styled-components";
import {
  FaProjectDiagram,
  FaCogs,
  FaExpandArrowsAlt,
  FaShieldAlt,
  FaUsers,
  FaHandshake,
} from "react-icons/fa";
import { useTranslations } from "next-intl";
interface Feature {
  id: number;
  index: number;
  title: string;
  content: string;
}
const iconMap: Record<number, React.ReactNode> = {
  1: <FaProjectDiagram />,
  2: <FaCogs />,
  3: <FaExpandArrowsAlt />,
  4: <FaShieldAlt />,
  5: <FaUsers />,
  6: <FaHandshake />,
};

const FeatureGrid = () => {
  const t = useTranslations("home");

  const features: Feature[] = Object.entries(t.raw("Feature.items")).map(
    ([key, value]: [string, any]) => ({
      id: parseInt(key, 10),
      index: parseInt(key, 10),
      title: value.title,
      content: value.content,
    })
  );

  return (
    <SectionWrapper>
      <GridWrapper>
        {features.map((item, idx) => (
          <Card key={item.id}>
            <div className="icon">{iconMap[item.index] || <FaCogs />}</div>
            <h3 dangerouslySetInnerHTML={{ __html: item.title }} />
            <p dangerouslySetInnerHTML={{ __html: item.content }} />
          </Card>
        ))}
      </GridWrapper>
    </SectionWrapper>
  );
};

/* --- Style --- */
const SectionWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: clamp(2rem, 5vw, 6rem) 1rem;
`;

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: clamp(16px, 3vw, 48px);
  max-width: 1400px;
  width: 100%;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr); /* Tablet: 2 cột */
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr); /* Desktop: 3 cột */
  }

  @media (min-width: 1600px) {
    grid-template-columns: repeat(3, 1fr); /* Desktop lớn: 4 cột */
  }
`;

const Card = styled.div`
  padding: clamp(1.25rem, 2vw, 3rem);
  border-radius: clamp(0.75rem, 1.2vw, 1.5rem);
  backdrop-filter: blur(12px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  transition: all 0.3s ease;
  cursor: default;

  .icon {
    margin-bottom: clamp(0.75rem, 1.2vw, 1.5rem);
    font-size: clamp(2rem, 3vw, 5rem);
    color: #44b9f0ff;
    transition: color 0.3s ease;
  }

  .icon:hover {
    color: #49dff3ff;
  }

  h3 {
    margin: 0;
    font-size: clamp(1.5rem, 2vw, 2.8rem);
    font-weight: 600;
    color: #ffffff;
  }

  p {
    margin-top: clamp(0.5rem, 1vw, 1.25rem);
    font-size: clamp(0.9rem, 1.1vw, 1.5rem);
    color: #cfcfcf;
    line-height: 1.6;
    max-width: 40ch;
  }

  &:hover {
    .icon {
      color: #90caf9;
    }
  }
`;

export default FeatureGrid;
