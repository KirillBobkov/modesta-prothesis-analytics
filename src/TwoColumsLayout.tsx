import React, { useState, useEffect } from "react";
import styles from "./TwoColumnLayout.module.css";
import Box from "@mui/material/Box";
import { Button, ThemeProvider, createTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts/LineChart";
import { Observable, Subscription, interval } from "rxjs";
import { connect } from "./connect";
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';


const TwoColumnLayout = () => {
  const [subscription, setSubscription] = useState<Subscription | undefined>(
    undefined
  );

  const [trainingData, setTrainingData] = useState<number[]>([]);
  const [currentValue, setCurrentValue] = useState<number | undefined>(
    undefined
  );

  const handleConnect = () => {
    const newSubscription = connect().subscribe((value: any) => {
      setCurrentValue(value * 10);
    });
    setSubscription(newSubscription);
  };

  const handleDisconnect = () => {
    subscription?.unsubscribe();
    setSubscription(undefined);
  };

  useEffect(() => {
    if (currentValue !== undefined) {
      setTrainingData((prevData: number[]) => [...prevData, currentValue]);
    }
  }, [currentValue]);

  const newTheme = createTheme({ palette: { mode: "dark" } });

  return (
    <ThemeProvider theme={newTheme}>
      <div className={styles.layout}>
        <div className={`${styles.column} ${styles.columnLeft}`}>
          <div className={styles.container}>
            <h1 className={styles.title}>Управление Bluetooth</h1>
            <div className={styles.buttons}>
              <Button
                variant="contained"
                classes={{ colorPrimary: "#DCE359" }}
                color="success"
                onClick={handleConnect}
              >
                Подключить
              </Button>
              <Button
                variant="outlined"
                classes={{ colorPrimary: "#DCE359" }}
                color="success"
                onClick={handleDisconnect}
              >
                Отключить
              </Button>
            </div>
          </div>

          <div className={styles.container}>
            <h1 className={styles.title}>Профиль</h1>

            <div className={styles.person}>
              <div className={styles["person__avatar-container"]}>
                <img
                  alt="Портрет члена команды"
                  className={`${styles["person__avatar"]}`}
                  src="https://www.womanhit.ru/media/CACHE/images/articleimage2/2019/8/margo/a6c184fd913aa69ac5ee8fbf8bea049b.jpg"
                />
              </div>
              <p className={styles["person__info"]}>
                <span itemProp="name" className={styles["person__name"]}>
                  Марго Робби
                </span>
                <span className={styles["person__profession"]}>22.02.1994</span>
                <span className={styles["person__profession"]}>
                  +7 999 120 23 32
                </span>
                <span className={styles["person__profession"]}>
                  test@mail.ru
                </span>
              </p>
            </div>
          </div>
        </div>
        <div className={`${styles.column} ${styles.columnRight}`}>
          <div className={styles.container_chart}>
            <LineChart
              series={[
                {
                  data: trainingData,
                  showMark: false,
                  label: 'Ось X',
                },
              ]}
              height={200}
            />
          </div>
          <div className={styles.container_chart}>
            <LineChart
              series={[
                {
                  data: trainingData,
                  showMark: false,
                  label: 'Ось Y',
                },
              ]}
              height={200}
            />
          </div>
          <div className={styles.container_chart}>
            <LineChart
              series={[
                {
                  data: trainingData,
                  showMark: false,
                  label: 'Ось Z',
                },
              ]}
              height={200}
            />
          </div>
          <div className={styles.container_chart}>
            <ArcDesign />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

const settings = {
    width: 200,
    height: 200,
    value: 87,
  };
  
function ArcDesign() {
    return (
      <Gauge
        {...settings}
        title={'Заряд'}
        cornerRadius="50%"
        sx={(theme) => ({
          [`& .${gaugeClasses.valueText}`]: {
            fontSize: 40,
          },
          [`& .${gaugeClasses.valueArc}`]: {
            fill: '#52b202',
          },
          [`& .${gaugeClasses.referenceArc}`]: {
            fill: theme.palette.text.disabled,
          },
        })}
      />
    );
  }

export default TwoColumnLayout;
