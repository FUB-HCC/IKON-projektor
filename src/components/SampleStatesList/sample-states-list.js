import React from "react";

import { useDispatch } from "react-redux";
import style from "../SideBar/details-panel.module.css";
import { ReactComponent as Exit } from "../../assets/Exit.svg";
import { unClicked, sampleClicked } from "../../store/actions/actions";
const SampleStatesList = props => {
  const dispatch = useDispatch();
  var sampleList = [
    {
      name: "Forschungsprojekt Ansicht",
      link:
        "?state=eyJnIjoiMCIsImYiOlsiMSIsIjIiLCIzIiwiNCIsIjUiXSwidCI6WyIyMyIsIjI0IiwiMjIiLCI0IiwiMjgiLCIyOSIsIjEiLCIzIiwiMjciLCIyIiwiMzAiXSwidGkiOlsyMDA2LDIwMjNdLCJjIjpbIkJpYmxpb3RoZWsiLCJETkEtIHVuZCBHZXdlYmVzYW1tbHVuZyIsIkVtYnJ5b2xvZ2lzY2hlIFNhbW1sdW5nIiwiRmlzY2hlIiwiRmxpZWdlbiwgTfxja2VuIHVuZCBGbPZoZSIsIkZvc3NpbGUgRmlzY2hlIHVuZCBBbXBoaWJpZW4iLCJGb3NzaWxlIEdsaWVkZXJm/N9lciB1bmQgQmVybnN0ZWluLVNhbW1sdW5nIiwiRm9zc2lsZSBNdXNjaGVsbiwgU2NobmVja2VuLCBBcm1m/N9lciB1bmQgU2Nod+RtbWUiLCJGb3NzaWxlIFBmbGFuemVuIiwiRm9zc2lsZSBSZXB0aWxpZW4gdW5kIEbkaHJ0ZW4iLCJGb3NzaWxlIFPkdWdldGllcmUiLCJGb3NzaWxlIFN0YWNoZWxo5HV0ZXIiLCJGb3NzaWxlIFb2Z2VsIiwiSGF1dGZs/GdsZXIgdW5kIE5ldHpmbPxnbGVyIiwiSGVtaW1ldGFib2xhIiwiSGlzdG9yaXNjaGUgQmlsZC0gdW5kIFNjaHJpZnRndXRzYW1tbHVuZyIsIkvkZmVyIHVuZCBG5GNoZXJmbPxnbGVyIiwiS3JlYnN0aWVyZSIsIk1hcmluZSBXaXJiZWxsb3NlIiwiTWV0ZW9yaXRlIiwiTWlrcm9wYWzkb250b2xvZ2llIiwiTWlrcm9wYWzkb250b2xvZ2llIFNhbW1sdW5nIiwiTWluZXJhbGllbiIsIlBldHJvZ3JhcGhpc2NoLWxhZ2Vyc3TkdHRlbmt1bmRsaWNoZSBTYW1tbHVuZyIsIlJlcHRpbGllbiB1bmQgQW1waGliaWVuIiwiUmV6ZW50ZSBQZmxhbnplbiIsIlPkdWdldGllcmUiLCJTY2htZXR0ZXJsaW5nZSB1bmQgS/ZjaGVyZmxpZWdlbiIsIlNwaW5uZW50aWVyZSB1bmQgVGF1c2VuZGb832VyIiwiVGllcnN0aW1tZW5hcmNoaXYiLCJW9mdlbCIsIldlaWNodGllcmUiLCJXdXJtYXJ0aWdlIFRpZXJlIl0sImluIjpbIjNELUxhYm9yIiwiQmlvYWt1c3Rpc2NoZXMgTGFib3IiLCJHZW9jaGVtaXNjaGVyIHVuZCBtaWtyb2FuYWx5dGlzY2hlciBMYWJvcmtvbXBsZXgiLCJIb2NobGVpc3R1bmdzcmVjaG5lciIsIk1vbGVrdWxhcmdlbmV0aXNjaGUgTGFib3JlIiwiUGFs5G9udG9sb2dpc2NoZSBQcuRwYXJhdGlvbnNsYWJvcmUiXSwidGEiOlsiVW50ZXJuZWhtZXJpbm5lbiB1bmQgVW50ZXJuZWhtZXIiLCJLaW5kZXIgYWIgOCIsIkFyYmVpdHNtZWRpemluZXJpbm5lbiB1bmQgQXJiZWl0c21lZGl6aW5lciIsIkp1Z2VuZGxpY2hlIGFiIDEyIEphaHJlIiwiV2lzc2Vuc2NoYWZ0bGVyaW5uZW4gdW5kIFdpc3NlbnNjaGFmdGxlciIsIlBy5HBhcmF0b3Jpbm5lbiB1bmQgUHLkcGFyYXRvcmVuIiwiS2luZGVyIGFiIDEwIEphaHJlIiwiU2No/GxlcmlubmVuIHVuZCBTY2j8bGVyIiwiS/xuc3RsZXJpbm5lbiB1bmQgS/xuc3RsZXIiLCJab2xsIiwiS2luZGVyIGFiIDggSmFocmUiLCJLaW5kZXIiLCJCcmVpdGUg1mZmZW50bGljaGtlaXQiLCJTYW1tbHVuZ3NwZmxlZ2VyaW5uZW4gdW5kIFNhbW1sdW5nc3BmbGVnZXIiLCJQcmVzc2UiLCJKdWdlbmRsaWNoZSIsIkxlaHJlcmlubmVuIHVuZCBMZWhyZXIiLCJCZWj2cmRlbm1pdGFyYmVpdGVyaW5uZW4gdW5kIC1taXRhcmJlaXRlciIsIkVyd2FjaHNlbmUiLCJN5GRjaGVuIGFiIGRlciA1LiBLbGFzc2UiLCJQb2xpemVpIiwiS2luZGVyIGFiIDUgSmFocmUiLCJLTVUiLCJQb2xpdGlrIiwiS2luZGVyIGFiIDYiLCJC/HJnZXJmb3JzY2hlcmlubmVuIHVuZCBC/HJnZXJmb3JzY2hlciIsIlBvbGl0aWtlcmlubmVuIHVuZCBQb2xpdGlrZXIiLCJLdWx0dXJzY2hhZmZlbmRlIiwiV2lydHNjaGFmdCIsIlNhbW1sZXJpbm5lbiB1bmQgU2FtbWxlciIsIldpc3NlbnNjaGFmdCIsIkVudHdpY2tsZXJpbm5lbiB1bmQgRW50d2lja2xlciIsIkVyemllaGVyaW5uZW4gdW5kIEVyemllaGVyIiwiUXVhcnRpZXJzbWFuYWdlbWVudCBCcnVubmVudmllcnRlbCJdLCJmbyI6WyJQcmVzc2Vrb25mZXJlbnoiLCJQcmVzc2VtaXR0ZWlsdW5nIiwiUGFydGl6aXBhdGlvbnNhbmdlYm90IiwiU29uZGVyYXVzc3RlbGx1bmciLCJBdXNzdGVsbHVuZyIsIkb8aHJ1bmciLCJXb3Jrc2hvcCIsIkFic2NoaWVkc3BhcnR5IiwiS29vcGVyYXRpb24iLCJCZWl0cmFnIGluIFNhbW1lbGJhbmQiLCJCZXJhdHVuZyIsIkJlcmljaHQiLCJQdWJsaWthdGlvbiIsIk5ldHp3ZXJrYW5hbHlzZSIsIlRhZ3VuZ3NiZXJpY2h0IiwiQWt0aW9uc3RhZyIsIkxlaHJtYXRlcmlhbGllbiIsIkNpdGl6ZW4gU2NpZW5jZSBBa3Rpdml05HQiLCJwb3B1bORyd2lzc2Vuc2NoYWZ0bGljaGVyIEJlaXRyYWciLCJQb2RpdW1zZGlza3Vzc2lvbiIsIlZvcnRyYWciLCJIYWNrYXRob24iLCJBYmVuZHZlcmFuc3RhbHR1bmciLCJpbnRlcmFrdGl2ZSBBbndlbmR1bmciLCJTY2h1bGJpbGR1bmdzYW5nZWJvdCIsIkJhcmNhbXAiLCJEb2t1bWVudGF0aW9uIFdvcmtzaG9wIiwiU2hvdyIsIlZpcnR1YWwtUmVhbGl0eSBBbndlbmR1bmciLCJHaXJscycgZGF5IiwiV2lzc2Vuc2NoYWZ0IGtvbW11bml6aWVyZW4iLCJLaW5kZXJzb25udGFnIiwiQnVjaCIsIkZyZWl6ZWl0YW5nZWJvdCIsIkFwcCIsIkJlcmVpdHN0ZWxsdW5nIEluZnJhc3RydWt0dXIiLCJPZmZlbmVzIE5hY2htaXR0YWdzYW5nZWJvdCIsIldhbmRlcmF1c3N0ZWxsdW5nIiwiUGxhdHRmb3JtIiwiTXVzZXVtc2Zlc3QiLCJTYW1tZWxiYW5kIiwiUGVyZm9ybWFuY2UiLCJJbmZyYXN0cnVrdHVyIFBhcnRpemlwYXRpb25zcmF1bSIsIlNjaPxsZXJ0cmFpbmluZyIsIkJlaXRyYWcgaW4gWmVpdHNjaHJpZnQiLCJRdWl6IiwiWmVpdHNjaHJpZnRlbmJlaXRyYWciLCJWb3JsZXN1bmciLCJWZXJhbnN0YWx0dW5nc3JlaWhlIiwiRGF0ZW5iYW5rIiwiV2lzc2Vuc3RyYW5zZmVyIPxiZXIgUGVyc29uIl0sImhsZiI6WyJaaWVsZ3J1cHBlbiIsIkZvcm1hdGUiLCJMYWJvcmdlcuR0ZSIsIlNhbW1sdW5nZW4iXSwiY2wiOlsicHJvamVjdCIsMTQwMDMxXX0="
    }
  ];
  return (
    <div className={style.DetailsWrapper}>
      <div className={style.DetailsTitle}>
        <div
          className={style.DetailsExit}
          onClick={() => dispatch(unClicked())}
        >
          <Exit height={35} width={35} />
        </div>
        <span className={style.titleTopic}>
          Beispielabfragen und geteilte Ansichten
        </span>
      </div>
      <div className={style.infoItems}>
        {sampleList.map((sample, i) => {
          return (
            <span
              className={style.SampleLink}
              key={sample.name + " " + i}
              onClick={() => dispatch(sampleClicked(sample.link))}
            >
              {sample.name}
            </span>
          );
        })}
      </div>
    </div>
  );
};

export default SampleStatesList;
