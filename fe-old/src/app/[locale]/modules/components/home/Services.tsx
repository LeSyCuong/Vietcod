"use client";

import styled from "styled-components";
import React from "react";
import {
  FaGamepad,
  FaLaptopCode,
  FaServer,
  FaHandsHelping,
} from "react-icons/fa";
import { useTranslations } from "next-intl";
import Link from "next/link";
export default function Services() {
  const t = useTranslations("home");
  const headerTitle = t("Service.header.title");
  const headerContent = t("Service.header.content");

  const services = [
    {
      id: 1,
      index: 1,
      title: t("Service.items.1.title"),
      content: t("Service.items.1.content"),
    },
    {
      id: 2,
      index: 2,
      title: t("Service.items.2.title"),
      content: t("Service.items.2.content"),
    },
    {
      id: 3,
      index: 3,
      title: t("Service.items.3.title"),
      content: t("Service.items.3.content"),
    },
    {
      id: 4,
      index: 4,
      title: t("Service.items.4.title"),
      content: t("Service.items.4.content"),
    },
  ];

  const iconMap: Record<number, React.ElementType> = {
    1: FaGamepad,
    2: FaLaptopCode,
    3: FaServer,
    4: FaHandsHelping,
  };

  const StyledWrapper = styled.div`
    button.learn-more {
      position: relative;
      display: inline-block;
      cursor: pointer;
      outline: none;
      border: 0;
      vertical-align: middle;
      text-decoration: none;
      background: transparent;
      padding: 0;
      font-size: inherit;
      font-family: inherit;

      width: 16rem;
      height: auto;

      .circle {
        transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
        position: relative;
        display: block;
        margin: 0;
        width: 3rem;
        height: 3rem;
        background: linear-gradient(to bottom right, #1d4ed8, #5eddf3ff);
        border-radius: 1.625rem;

        .icon {
          transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
          position: absolute;
          top: 0;
          bottom: 0;
          margin: auto;
          background: #fff;
        }

        .icon.arrow {
          left: 0.625rem;
          width: 1.125rem;
          height: 0.125rem;
          background: none;

          &::before {
            position: absolute;
            content: "";
            top: -0.29rem;
            right: 0.0625rem;
            width: 0.625rem;
            height: 0.625rem;
            border-top: 0.125rem solid #fff;
            border-right: 0.125rem solid #fff;
            transform: rotate(45deg);
          }
        }
      }

      .button-text {
        transition: all 0.45s cubic-bezier(0.65, 0, 0.076, 1);
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        padding: 0.75rem 0;
        margin: 0 0 0 1.85rem;
        color: #1d4ed8;
        font-weight: 700;
        line-height: 1.6;
        text-align: center;
        text-transform: uppercase;
      }

      &:hover .circle {
        width: 100%;
      }

      &:hover .circle .icon.arrow {
        background: #fff;
        transform: translate(1rem, 0);
      }

      &:hover .button-text {
        color: #fff;
      }
    }
  `;

  return (
    <section id="services" className="py-24 bg-[#e8e8e8]">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-3 tracking-tight">
            {headerTitle}
          </h3>
          <p className="text-gray-600 mt-5 max-w-3xl mx-auto leading-relaxed text-lg">
            {headerContent}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12">
          {services.map((s) => {
            const Icon = iconMap[s.index] || FaServer;
            return (
              <div
                key={s.id}
                className="group relative rounded-[30px] bg-[#e8e8e8] p-10 flex flex-col items-center text-center transform transition-all duration-500"
                style={{
                  boxShadow: "15px 15px 30px #bebebe, -15px -15px 30px #ffffff",
                }}
              >
                <div className="w-20 h-20 mb-6 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-cyan-200 text-white text-3xl shadow-lg transition-transform duration-500">
                  <Icon />
                </div>

                <h4 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">
                  {s.title}
                </h4>

                <p className="text-gray-700 leading-relaxed text-base">
                  {s.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* Call To Action */}
        <div className="text-center mt-20">
          <StyledWrapper>
            <Link href="/pages/products">
              {" "}
              <button
                className="learn-more"
                aria-label={t("Service.ViewAllService")}
              >
                <span className="circle" aria-hidden="true">
                  <span className="icon arrow" />
                </span>
                <span className="button-text">
                  {t("Service.ViewAllService")}
                </span>
              </button>
            </Link>
          </StyledWrapper>
        </div>
      </div>
    </section>
  );
}
