import secureLocalStorage from 'react-secure-storage';

const url = process.env.NEXT_PUBLIC_API || process.env.REACT_APP_API || '/api/';
const auth = '';

export function signinWithApi(email, password) {
  return new Promise((resolve, reject) => {
    const body = {
      identifier: email,
      password,
    };
    fetch(`${url}sign-on`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: auth,
        AccessToken: 'key',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.id) {
          secureLocalStorage.setItem('user_token', JSON.stringify(responseJson));

          getcustomerdetail(responseJson.hash).then((result) => {
            secureLocalStorage.setItem('user_info', JSON.stringify(result));
            secureLocalStorage.setItem('name', `${result.fname} ${result.lname}`);
            secureLocalStorage.setItem('email', result.email);
            resolve(responseJson);
          });
        } else {
          resolve(responseJson);
        }
      })
      .catch((error) => {
        console.warn('error', error);
      });
  });
}

export function getlistofsims(id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const raw = JSON.stringify({
      customer_id: user.id,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list-sims`, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

export function getlistofgateways(id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const raw = JSON.stringify({
      customer_id: user.id,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list-one-offs`, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

export function getlistofactivationsims(id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const raw = JSON.stringify({
      customer_id: user.id,
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list-activation-sims`, requestOptions)
      .then((response) => response.json())
      .then((result) => resolve(result))
      .catch((error) => reject(error));
  });
}

export function placesimsorder(
  simid,
  qty,
  shipping,
  billing,
  addon,
  selectedno,
  zipcode,
  textArea,
  itemsArray
) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    if (simid) {
      for (let i = 0; i < qty; i++) {
        formdata.append(`orders[${i}][sim_id]`, simid);
      }
    }

    if (addon) {
      formdata.append(`number_change`, 1);
      if (zipcode != '') {
        formdata.append(`zip_code`, zipcode);
      }

      if (textArea) {
        for (let i = 0; i < qty; i++) {
          if (textArea[i] != '') {
            formdata.append(`orders[${i}][subscription_id]`, textArea[i].id);
            formdata.append(`orders[${i}][addon_id][0]`, addon.id);
          }
        }
      } else {
        for (let i = 0; i < qty; i++) {
          formdata.append(`orders[${i}][subscription_id]`, selectedno[i].id);
          formdata.append(`orders[${i}][addon_id][0]`, addon.id);
        }
      }
    }
    if (itemsArray) {
      let i = 0;
      for (let j = 0; j < itemsArray.filter((obj) => obj.type === 'sims').length; j++) {
        const k = i + parseInt(itemsArray.filter((obj) => obj.type === 'sims')[j].qty);

        while (i < k) {
          formdata.append(
            `orders[${i}][sim_id]`,
            itemsArray.filter((obj) => obj.type === 'sims')[j].sim_id
          );
          i++;
        }
      }

      i = 0;
      for (let j = 0; j < itemsArray.filter((obj) => obj.type === 'one_offs').length; j++) {
        const k = i + parseInt(itemsArray.filter((obj) => obj.type === 'one_offs')[j].qty);

        while (i < k) {
          formdata.append(
            `orders[${i}][one_off_id]`,
            itemsArray.filter((obj) => obj.type === 'one_offs')[j].sim_id
          );
          i++;
        }
      }

      i = 0;
      for (
        let j = 0;
        j < itemsArray.filter((obj) => obj.type == 'standard_recurring_plan').length;
        j++
      ) {
        const k =
          i + parseInt(itemsArray.filter((obj) => obj.type == 'standard_recurring_plan')[j].qty);

        while (i < k) {
          formdata.append(
            `orders[${i}][plan_id]`,
            itemsArray.filter((obj) => obj.type == 'standard_recurring_plan')[j].sim_id
          );
          i++;
        }
      }
    }

    formdata.append('plan_activation', 0);
    formdata.append('shipping_fname', shipping.firstname);
    formdata.append('shipping_lname', shipping.lastname);

    formdata.append('shipping_address1', shipping.streetaddress);

    if (shipping.streetaddress2 != '' && shipping.streetaddress2 != null) {
      formdata.append('shipping_address2', shipping.streetaddress2);
    }
    formdata.append('shipping_city', shipping.city);
    formdata.append('shipping_state_id', shipping.state);
    formdata.append('shipping_zip', shipping.zipcode);

    formdata.append('billing_fname', billing.firstname);
    formdata.append('billing_lname', billing.lastname);

    formdata.append('billing_address1', billing.streetaddress);
    if (billing.streetaddress2 != '' && billing.streetaddress2 != null) {
      formdata.append('billing_address2', billing.streetaddress2);
    }
    formdata.append('billing_city', billing.city);
    formdata.append('billing_state_id', billing.state);
    formdata.append('billing_zip', billing.zipcode);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/create-bulk-order`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function addbillingcard(cardname, cardno, mmyy, cvv, bill, amount, orderhash) {
  return new Promise((resolve, reject) => {
    // if (amount === "0.00" || amount === 0) {
    //   resolve({ success: true });
    // }

    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    if (amount != '0.00' && amount != 0) {
      formdata.append('amount', amount);
      formdata.append('new_card', 1);
    } else {
      formdata.append('amount', 0);
    }
    formdata.append('billing_fname', bill.billing_fname);
    formdata.append('billing_lname', bill.billing_lname);
    formdata.append('billing_address1', bill.billing_address1);
    formdata.append('billing_address2', bill.billing_address2);
    formdata.append('billing_city', bill.billing_city);
    formdata.append('billing_state_id', bill.billing_state_id);
    formdata.append('billing_zip', bill.billing_zip);
    formdata.append('payment_card_no', cardno);
    formdata.append('payment_card_holder', cardname);
    formdata.append('expires_mmyy', mmyy);
    formdata.append('payment_cvc', cvv);
    formdata.append('order_hash', orderhash);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}add-card`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.success == true) {
          result.primary = 1;
          resolve(result);
        } else if (amount == 0 || amount == '0.00') {
          resolve({ success: true, primary: 0 });
        } else {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getcustomercards() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}customer-cards`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getcustomeraccounts() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}customer-bank-accounts/get`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getCreditBalance() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}payment/get-balance-amount`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function chargefromcard(cardid, amount = 0, fname, lname, orderhash) {
  return new Promise((resolve, reject) => {
    if (amount > 0) {
      const myHeaders = new Headers();
      const user = JSON.parse(secureLocalStorage.getItem('user_token'));
      myHeaders.append('AccessToken', 'key');
      myHeaders.append('Authorization', auth);

      const formdata = new FormData();
      formdata.append('customer_id', user.id);
      formdata.append('amount', amount);
      formdata.append('credit_card_id', cardid);
      formdata.append('billing_fname', fname);
      formdata.append('billing_lname', lname);
      formdata.append('order_hash', orderhash);
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${url}charge-card`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
          console.warn(error);
        });
    } else {
      resolve({ success: true });
    }
  });
}

export function chargefromaccount(bankid, amount = 0, withOutOrder, order_hash) {
  return new Promise((resolve, reject) => {
    if (amount > 0) {
      const myHeaders = new Headers();
      const user = JSON.parse(secureLocalStorage.getItem('user_token'));
      myHeaders.append('AccessToken', 'key');
      myHeaders.append('Authorization', auth);

      const formdata = new FormData();
      formdata.append('customer_id', user.id);
      formdata.append('amount', amount);
      formdata.append('customer_bank_account_id', bankid);

      if (order_hash) formdata.append('order_hash', order_hash);
      if (withOutOrder) {
        formdata.append('without_order', 1);
      }
      // formdata.append("billing_fname", fname);
      // formdata.append("billing_lname", lname);
      // formdata.append("order_hash", orderhash);
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${url}customer-bank-accounts/charge-account`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
          console.warn(error);
        });
    } else {
      resolve({ status: 'success' });
    }
  });
}

export function chargefromCreditBalance(
  chargedAmount,
  balance,
  payFromBalance,
  order_hash,
  payment_method
) {
  return new Promise((resolve, reject) => {
    if (payFromBalance) {
      const myHeaders = new Headers();
      const user = JSON.parse(secureLocalStorage.getItem('user_token'));
      myHeaders.append('AccessToken', 'key');
      myHeaders.append('Authorization', auth);

      let actualDeduction = 0;
      if (Number(chargedAmount) > Number(balance)) actualDeduction = balance;
      if (Number(chargedAmount) == Number(balance)) actualDeduction = balance;
      if (Number(chargedAmount) < Number(balance)) actualDeduction = chargedAmount;

      const formdata = new FormData();
      formdata.append('customer_id', user.id);
      formdata.append('amount', actualDeduction);
      formdata.append('order_hash', order_hash);
      if (payment_method) {
        formdata.append('payment_method', 'bank-account');
      } else {
        formdata.append('payment_method', 'credit-card');
      }
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${url}payment/pay-via-credit-balance`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
          console.warn(error);
        });
    } else {
      resolve({
        status: 'success',
        data: {
          credits_used: [
            {
              id: 21360,
              used_amount: '2',
            },
          ],
          total_credit_applied: 2,
          remaining_cart_amount: chargedAmount,
        },
        message: 'Payment successfully processed using credit balance.',
      });
    }
  });
}

export function getsimplans(id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('sim_id', id);
    formdata.append('customer_id', user.id);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list-order-plans`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getstandardplans() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list-standard-recurring-plans`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function ordersubscription(itemsArray, zipcode, textArea, shipping, billing, simid) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('shipping_fname', shipping.firstname);
    formdata.append('shipping_lname', shipping.lastname);
    formdata.append('shipping_address1', shipping.streetaddress);
    if (shipping.streetaddress2 != '' && shipping.streetaddress2 != null) {
      formdata.append('shipping_address2', shipping.streetaddress2);
    }
    formdata.append('shipping_city', shipping.city);
    formdata.append('shipping_state_id', shipping.state);
    formdata.append('shipping_zip', shipping.zipcode);

    formdata.append('billing_fname', billing.firstname);
    formdata.append('billing_lname', billing.lastname);
    formdata.append('billing_address1', billing.streetaddress);
    if (billing.streetaddress2 != '' && billing.streetaddress2 != null) {
      formdata.append('billing_address2', billing.streetaddress2);
    }
    formdata.append('billing_city', billing.city);
    formdata.append('billing_state_id', billing.state);
    formdata.append('billing_zip', billing.zipcode);

    if (itemsArray.some((obj) => obj.type == 'standard_subscription')) {
      const obj = itemsArray.filter((obj) => obj.type == 'standard_subscription')[0];
      zipcode && formdata.append('zip_code', zipcode);
      formdata.append('plan_id', obj.plan_id);
      formdata.append('sim_id', obj.sim_id);
      formdata.append('sim_numbers', obj.text);
      obj.sim_imeis && formdata.append('sim_imeis', obj.sim_imeis);
    }

    let i = 0;
    for (
      let j = 0;
      j < itemsArray.filter((obj) => obj.type == 'standard_recurring_plan').length;
      j++
    ) {
      const k =
        i + parseInt(itemsArray.filter((obj) => obj.type == 'standard_recurring_plan')[j].qty);

      while (i < k) {
        formdata.append(
          `orders[${i}][plan_id]`,
          itemsArray.filter((obj) => obj.type == 'standard_recurring_plan')[j].plan_id
        );
        i++;
      }
    }

    formdata.append('plan_activation', '1');

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order-subscriptions`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function csvordersubscription(planid, csv, shipping, billing, sim, order) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();

    formdata.append('customer_id', user.id);

    formdata.append('plan_id', planid);
    formdata.append('sim_id', sim.id);
    formdata.append('csv_file', csv);
    formdata.append('plan_activation', 1);

    if (order?.hash) formdata.append('order_hash', order?.hash);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/csv-order-subscriptions`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function ordersummary(
  simid,
  qty,
  plan,
  shipping,
  addon,
  selectedno,
  textArea,
  itemsArray,
  paymentmethod
) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const userinfo = JSON.parse(secureLocalStorage.getItem('user_info'));
    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    formdata.append('shipping_fname', userinfo.shipping_fname);
    formdata.append('shipping_lname', userinfo.shipping_lname);
    formdata.append('shipping_address1', userinfo.shipping_address1);
    formdata.append('shipping_address2', userinfo.shipping_address2);
    formdata.append('shipping_city', userinfo.shipping_city);
    formdata.append('shipping_state_id', userinfo.shipping_state_id);
    formdata.append('shipping_zip', userinfo.shipping_zip);

    if (paymentmethod === 1) {
      formdata.append('payment_method', 'bank-account');
    } else if (paymentmethod === 0) {
      formdata.append('payment_method', 'credit-card');
    } else {
      formdata.append(
        'payment_method',
        userinfo.primary_payment_account?.payment_account_type === 'bank-account'
          ? 'bank-account'
          : 'credit-card'
      );
    }

    if (simid) {
      for (let i = 0; i < qty; i++) {
        formdata.append(`orders[${i}][sim_id]`, simid);
      }
    }
    if (plan) {
      formdata.append('plan_activation', '1');
      // for (let i = 0; i < qty; i++) {
      //   formdata.append(`orders[${i}][plan_id]`, plan.id);
      // }
    }

    if (addon) {
      formdata.append(`number_change`, 1);

      if (textArea) {
        for (let i = 0; i < qty; i++) {
          if (textArea[i] != '') {
            formdata.append(`orders[${i}][subscription_id]`, textArea[i].id);
            formdata.append(`orders[${i}][addon_id][0]`, addon.id);
          }
        }
      } else {
        for (let i = 0; i < qty; i++) {
          formdata.append(`orders[${i}][subscription_id]`, selectedno[i].id);
          formdata.append(`orders[${i}][addon_id][0]`, addon.id);
        }
      }
    }

    if (itemsArray) {
      let i = 0;
      for (let j = 0; j < itemsArray.filter((obj) => obj.type == 'sims').length; j++) {
        const k = i + parseInt(itemsArray.filter((obj) => obj.type == 'sims')[j].qty);

        while (i < k) {
          formdata.append(
            `orders[${i}][sim_id]`,
            itemsArray.filter((obj) => obj.type == 'sims')[j].sim_id
          );
          i++;
        }
      }

      for (let j = 0; j < itemsArray.filter((obj) => obj.type == 'one_offs').length; j++) {
        const k = i + parseInt(itemsArray.filter((obj) => obj.type == 'one_offs')[j].qty);

        while (i < k) {
          formdata.append(
            `orders[${i}][one_off_id]`,
            itemsArray.filter((obj) => obj.type == 'one_offs')[j].sim_id
          );
          i++;
        }
      }

      i = 0;
      for (
        let j = 0;
        j < itemsArray.filter((obj) => obj.type == 'standard_subscription').length;
        j++
      ) {
        const obj = itemsArray.filter((obj) => obj.type == 'standard_subscription')[j];

        for (i = 0; i < obj.qty; i++) {
          formdata.append(`orders[${i}][sim_id]`, obj.sim_id);
          formdata.append(`orders[${i}][plan_id]`, obj.plan_id);
        }
      }

      for (
        let j = 0;
        j < itemsArray.filter((obj) => obj.type == 'standard_recurring_plan').length;
        j++
      ) {
        const k =
          i + parseInt(itemsArray.filter((obj) => obj.type == 'standard_recurring_plan')[j].qty);

        while (i < k) {
          formdata.append(
            `orders[${i}][plan_id]`,
            itemsArray.filter((obj) => obj.type == 'standard_recurring_plan')[j].plan_id
          );
          i++;
        }
      }
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order-summary`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function listordersims(simid, perpage = 50000, page = 1, id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    formdata.append('per_page', perpage);
    formdata.append('page', page);
    formdata.append('sim_id', simid);
    if (id) {
      formdata.append('order_id', id);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list-order-sims`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getcustomerdetail() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('hash', user && user.hash);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}customer-details`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        result.data.customer.order = result.data.order;
        secureLocalStorage.setItem('user_info', JSON.stringify(result.data.customer));
        resolve(result.data.customer);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function updateshippingaddress(shipping) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('hash', user.hash);
    formdata.append('id', user.id);
    formdata.append('shipping_fname', shipping.firstname);
    formdata.append('shipping_lname', shipping.lastname);
    formdata.append('shipping_address1', shipping.streetaddress);
    formdata.append('shipping_address2', shipping.streetaddress2);
    formdata.append('shipping_zip', shipping.zipcode);
    formdata.append('shipping_city', shipping.city);
    formdata.append('shipping_state_id', shipping.state);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}update-customer`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
        getcustomerdetail().then((result) => {
          secureLocalStorage.setItem('user_info', JSON.stringify(result));
        });
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function updatebillingaddress(billing) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('hash', user.hash);
    formdata.append('id', user.id);
    formdata.append('billing_fname', billing.firstname);
    formdata.append('billing_lname', billing.lastname);
    formdata.append('billing_address1', billing.streetaddress);
    formdata.append('billing_address2', billing.streetaddress2);
    formdata.append('billing_zip', billing.zipcode);
    formdata.append('billing_city', billing.city);
    formdata.append('billing_state_id', billing.state);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}update-customer`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
        getcustomerdetail().then((result) => {
          secureLocalStorage.setItem('user_info', JSON.stringify(result));
        });
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getcustomersubscription() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}customer-subscriptions?hash=${user.hash}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getcustomersubscriptionfresh(planid) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    if (planid) {
      formdata.append('plan_id', planid);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    fetch(`${url}customer-subscriptions?hash=${user.hash}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getcustomersubscriptionNew(planid) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    if (planid) {
      formdata.append('plan_id', planid);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    fetch(`${url}customer-subscriptions-detail?hash=${user.hash}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function onetimeinvoice(
  planActivation = 1,
  orderhash,
  numberchange,
  onetimeinvoice,
  paymentmethod
) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('order_hash', orderhash);

    if (numberchange) {
      formdata.append('number_change', 1);
      formdata.append('plan_activation', 0);
    }
    if (planActivation) {
      formdata.append('plan_activation', planActivation);
    }

    if (paymentmethod) {
      formdata.append('payment_method', 'bank-account');
    } else {
      formdata.append('payment_method', 'credit-card');
    }

    let apiurl = 'bulk-order/generate-one-time-invoice';

    if (onetimeinvoice) {
      if (onetimeinvoice === 'changeplan')
        apiurl = 'bulk-order/upgrade-downgrade/generate-one-time-invoice';
      else if (onetimeinvoice === 'changeaddon')
        apiurl = 'bulk-order/upgrade-downgrade/addons/generate-one-time-invoice';
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(url + apiurl, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function savelabel(id, label) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('id', id);
    formdata.append('label', label);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}update-sub-label`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function validatezipcodeapi(zip) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('zip_code', zip);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/ultra/validate-zip-code`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getUsages(id, type, currentcycle, act_date) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const formdata = new FormData();
    const usageTypeMap = {
      1: 'voice',
      2: 'text',
      3: 'data',
      voice: 'voice',
      text: 'text',
      data: 'data',
    };
    const usageType = usageTypeMap[type] || type;
    let cycleDate = currentcycle;

    // API expects cycle_date in YYYY-MM-01 format.
    if (/^\d{6}$/.test(`${currentcycle}`)) {
      cycleDate = `${`${currentcycle}`.slice(0, 4)}-${`${currentcycle}`.slice(4, 6)}-01`;
    } else if (/^\d{4}-\d{2}$/.test(`${currentcycle}`)) {
      cycleDate = `${currentcycle}-01`;
    }

    formdata.append('subscription_id', id);
    formdata.append('usage_type', usageType);
    formdata.append('cycle_date', cycleDate);

    const requestOptions = {
      method: 'POST',
      body: formdata,
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}line/usage-logs`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getBillinghistory() {
  return new Promise((resolve, reject) => {
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${url}customer-billing-detail?hash=${user.hash}&per_page=50&page=1invoice_count=26&credit_count=24`,
      requestOptions
    )
      .then((response) => resolve(response.json()))

      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function addonNumberchange() {
  return new Promise((resolve, reject) => {
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');
    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    fetch(`${url}bulk-order/addons/number-change`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function checkkeligibility() {
  return new Promise((resolve, reject) => {
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');
    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    fetch(`${url}bulk-order/upgrade-downgrade/check-eligibility`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function eligibleNumberchange(addonid) {
  return new Promise((resolve, reject) => {
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');
    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    formdata.append('addon_id', addonid);
    formdata.append('per_page', 1000);
    formdata.append('page', 1);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    fetch(`${url}bulk-order/lines/eligible-for-number-change`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function numberchangehistory() {
  return new Promise((resolve, reject) => {
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');
    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    formdata.append('per_page', 10000);
    formdata.append('page', 1);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    fetch(`${url}bulk-order/lines/number-change-history`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function csvnumberchange(csv, addon) {
  return new Promise((resolve, reject) => {
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');
    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    formdata.append('csv_file', csv);
    formdata.append('addon_id', addon.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };

    fetch(`${url}bulk-order/order/csv-number-changes/`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function UpdateCustomerInformation(obj) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    // myHeaders.append("Content-Type", "application/json");

    const formdata = new FormData();
    formdata.append('id', user.id);
    formdata.append('hash', user.hash);

    Object.keys(obj).map((current, i) => {
      formdata.append(current, Object.values(obj)[i]);
    });

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}update-customer`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        getcustomerdetail().then((result2) => {
          secureLocalStorage.setItem('user_info', JSON.stringify(result2));
          resolve(result);
        });
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function addAccountAndCharge(obj, amount, orderhash) {
  return new Promise((resolve, reject) => {
    if (amount != '0.00' && amount != 0) {
      const myHeaders = new Headers();
      const user = JSON.parse(secureLocalStorage.getItem('user_token'));
      myHeaders.append('AccessToken', 'key');
      myHeaders.append('Authorization', auth);
      const formdata = new FormData();
      formdata.append('billing_fname', obj.billing_fname);
      formdata.append('billing_lname', obj.billing_lname);
      formdata.append('billing_address1', obj.billing_address1);
      formdata.append('billing_city', obj.billing_city);
      formdata.append('billing_state_id', obj.billing_state_id);
      formdata.append('billing_zip', obj.billing_zip);
      formdata.append('routing_number', obj.routing_number);
      formdata.append('account_number', obj.account_number);
      formdata.append('amount', amount);
      formdata.append('name_on_account', obj.name_on_account);
      formdata.append('nick_name', 'Test test');
      formdata.append('make_primary', obj.make_primary);
      formdata.append('order_hash', orderhash);

      // obj.customer_id=user.id;
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow',
      };

      fetch(`${url}customer-bank-accounts/add-and-charge-account`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
          console.warn(error);
        });
    } else {
      addAccount(obj)
        .then((result) => {
          if (result.status == 'success') {
            resolve(result);
          } else {
            if (amount == '0.00' || amount == 0) {
              result.status = 'success';
              resolve(result);
            }
            resolve(result);
          }
        })
        .catch((result) => {
          result.status = 'success';
          resolve(result);
        });
    }
  });
}

export function addAccount(obj) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    var user = JSON.parse(secureLocalStorage.getItem('user_token'));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');

    var user = JSON.parse(secureLocalStorage.getItem('user_token'));
    obj.customer_id = user.id;

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}customer-bank-accounts/add`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function addbillingcardnew(
  cardHolderName,
  cardNumber,
  mmyy,
  cvv,
  userInfo,
  // newDate[0],
  // newDate[1],

  city,
  state,
  address,
  zip,
  primary
) {
  return new Promise((resolve, reject) => {
    const newDateUp = mmyy.split('/');
    const myHeaders = new Headers();
    // var user = JSON.parse(secureLocalStorage.getItem("user_token"));
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const formdata = new FormData();
    formdata.append('payment_card_holder', cardHolderName);
    formdata.append('expires_mmyy', mmyy);
    formdata.append('payment_cvc', cvv);
    // formdata.append("new_card", 1);
    // formdata.append("api_key", auth);
    formdata.append('month', newDateUp[0]);
    formdata.append('year', newDateUp[1]);
    formdata.append('payment_card_no', cardNumber);
    formdata.append('customer_id', userInfo.id);
    formdata.append('billing_fname', userInfo.billing_fname);
    formdata.append('billing_lname', userInfo.billing_lname);
    formdata.append('billing_address1', address);
    formdata.append('billing_city', city);
    formdata.append('billing_zip', zip);
    formdata.append('billing_state_id', state);
    {
      primary && formdata.append('make_primary', primary);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}add-card`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function RemoveCustomerCardService(customerid) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('customer_credit_card_id', customerid);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
    };
    fetch(`${url}remove-card?customer_credit_card_id=${customerid}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function RemoveCustomerAccountService(vendor_id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    // myHeaders.append("Content-Type", "application/json");
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('customer_bank_account_vendor_id', vendor_id);
    formdata.append('customer_id', user.id);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      redirect: 'follow',
      body: formdata,
    };
    fetch(`${url}customer-bank-accounts/remove`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function MakePrimaryCardService(creditCardId) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('customer_credit_card_id', creditCardId);
    formdata.append('id', user.id);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      // body: formdata,
      redirect: 'follow',
    };
    fetch(
      `${url}primary-card?customer_credit_card_id=${creditCardId}&id=${user.id}`,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
        getcustomerdetail().then((result2) => {
          secureLocalStorage.setItem('user_info', JSON.stringify(result2));
          // resolve(result);
        });
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function MakePrimaryAccountService(accountId) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('customer_bank_account_id', accountId);
    formdata.append('customer_id', user.id);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };
    fetch(`${url}customer-bank-accounts/make-primary`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
        getcustomerdetail().then((result2) => {
          secureLocalStorage.setItem('user_info', JSON.stringify(result2));
          // resolve(result);
        });
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function customerinvoices() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    fetch(`${url}customer-current-invoice?hash=${user.hash}&id=${user.id}`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function MakePayment(id, amount) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('credit_card_id', id);
    formdata.append('customer_id', user.id);
    formdata.append('amount', amount);
    formdata.append('without_order', true);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}charge-card`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getCompanyDetail() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Cache-Control', 'no-cache');
    myHeaders.append('Pragma', 'no-cache');
    myHeaders.append('Expires', '0');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(`${url}company/get-details`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export const getLogo = getCompanyDetail;

export function autoLogin(hash) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('identifier', hash);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}user-login`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.id) {
          secureLocalStorage.setItem('user_token', JSON.stringify(responseJson));

          getcustomerdetail(responseJson.hash).then((result) => {
            secureLocalStorage.setItem('user_info', JSON.stringify(result));
            secureLocalStorage.setItem('name', `${result.fname} ${result.lname}`);
            secureLocalStorage.setItem('email', result.email);
            resolve(responseJson);
          });
        } else {
          resolve(responseJson);
        }
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function closeLines(subs) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    for (let i = 0; i < subs.length; i++) {
      formdata.append(`orders[${i}][subscription_id]`, subs[i].id);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/close-lines`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function customerplansapi(planid) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    if (planid) {
      formdata.append('plan_id', planid);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list/plans-for-upgrade`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function listaddonapi(planid) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    if (planid) {
      formdata.append('plan_id', planid);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/list/addons-for-order`, requestOptions)
      .then((response) => response.json())
      .then((responseJson) => {
        resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function planchangeordersummary(newplan, oldplan, subscriptions, paymentmethod) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const userinfo = JSON.parse(secureLocalStorage.getItem('user_info'));

    // var formdata = new FormData();
    // formdata.append("customer_id", user.id);
    // formdata.append("shipping_fname", userinfo.shipping_fname);
    // formdata.append("shipping_lname", userinfo.shipping_lname);
    // formdata.append("shipping_address1", userinfo.shipping_address1);
    // formdata.append("shipping_address2", userinfo.shipping_address2);
    // formdata.append("shipping_city", userinfo.shipping_city);
    // formdata.append("shipping_state_id", userinfo.shipping_state_id);
    // formdata.append("shipping_zip", userinfo.shipping_zip);
    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('plan_id', newplan.id);
    formdata.append('active_plan_id', oldplan.id);

    if (paymentmethod === 1) {
      formdata.append('payment_method', 'bank-account');
    } else if (paymentmethod === 0) {
      formdata.append('payment_method', 'credit-card');
    }

    for (let i = 0; i < subscriptions.length; i++) {
      formdata.append(`orders[${i}][subscription_id]`, subscriptions[i].id);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/upgrade-downgrade/order-summary`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function orderupgradeplan(plan, activeplan, subscriptions) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const userinfo = JSON.parse(secureLocalStorage.getItem('user_info'));

    // var formdata = new FormData();
    // formdata.append("customer_id", user.id);
    // formdata.append("shipping_fname", userinfo.shipping_fname);
    // formdata.append("shipping_lname", userinfo.shipping_lname);
    // formdata.append("shipping_address1", userinfo.shipping_address1);
    // formdata.append("shipping_address2", userinfo.shipping_address2);
    // formdata.append("shipping_city", userinfo.shipping_city);
    // formdata.append("shipping_state_id", userinfo.shipping_state_id);
    // formdata.append("shipping_zip", userinfo.shipping_zip);
    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('plan_id', plan.id);
    formdata.append('active_plan_id', activeplan.id);
    for (let i = 0; i < subscriptions.length; i++) {
      formdata.append(`orders[${i}][subscription_id]`, subscriptions[i].id);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/upgrade-downgrade/create-order`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function addonchangeordersummary(addon, mode, subscriptions, paymentmethod) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const userinfo = JSON.parse(secureLocalStorage.getItem('user_info'));

    // var formdata = new FormData();
    // formdata.append("customer_id", user.id);
    // formdata.append("shipping_fname", userinfo.shipping_fname);
    // formdata.append("shipping_lname", userinfo.shipping_lname);
    // formdata.append("shipping_address1", userinfo.shipping_address1);
    // formdata.append("shipping_address2", userinfo.shipping_address2);
    // formdata.append("shipping_city", userinfo.shipping_city);
    // formdata.append("shipping_state_id", userinfo.shipping_state_id);
    // formdata.append("shipping_zip", userinfo.shipping_zip);
    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('addon_id', addon.id);
    formdata.append('mode', mode);

    if (paymentmethod) {
      formdata.append('payment_method', 'bank-account');
    } else {
      formdata.append('payment_method', 'credit-card');
    }

    for (let i = 0; i < subscriptions.length; i++) {
      formdata.append(`orders[${i}][subscription_id]`, subscriptions[i].id);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/upgrade-downgrade/addons/order-summary`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function orderupgradeaddon(addon, mode, subscriptions) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const userinfo = JSON.parse(secureLocalStorage.getItem('user_info'));

    // var formdata = new FormData();
    // formdata.append("customer_id", user.id);
    // formdata.append("shipping_fname", userinfo.shipping_fname);
    // formdata.append("shipping_lname", userinfo.shipping_lname);
    // formdata.append("shipping_address1", userinfo.shipping_address1);
    // formdata.append("shipping_address2", userinfo.shipping_address2);
    // formdata.append("shipping_city", userinfo.shipping_city);
    // formdata.append("shipping_state_id", userinfo.shipping_state_id);
    // formdata.append("shipping_zip", userinfo.shipping_zip);
    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('addon_id', addon.id);
    formdata.append('mode', mode);
    for (let i = 0; i < subscriptions.length; i++) {
      formdata.append(`orders[${i}][subscription_id]`, subscriptions[i].id);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/upgrade-downgrade/addons/create-order`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getorderdetail(orderhash, paymentmethod) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('customer_id', user.id);
    formdata.append('order_hash', orderhash);

    if (paymentmethod) {
      formdata.append('payment_method', 'bank-account');
    } else {
      formdata.append('payment_method', 'credit-card');
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order/get-details`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function removeOrderItem(order_hash, order_group) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const userinfo = JSON.parse(secureLocalStorage.getItem('user_info'));

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('order_hash', order_hash);

    for (let i = 0; i < order_group.length; i++) {
      formdata.append(`order_group_ids[${i}]`, order_group[i]);
    }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order-item/remove`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function addOrderItem(order_hash, sim, plan) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const userinfo = JSON.parse(secureLocalStorage.getItem('user_info'));

    const formdata = new FormData();
    formdata.append('customer_id', user.id);

    formdata.append('order_hash', order_hash);
    formdata.append('order_type', plan?.order_type ? plan.order_type : 1);

    if (sim) {
      for (let i = 0; i < sim.qty; i++) {
        if (sim.type == 'sims') formdata.append(`orders[${i}][sim_id]`, sim.sim_id);
        else if (sim.type === 'one_offs') formdata.append(`orders[${i}][one_off_id]`, sim.sim_id);
      }
    }

    if (plan) {
      if (plan.type == 'standard_subscription') {
        formdata.append('plan_id', plan.plan_id);
        formdata.append('sim_id', plan.sim_id);
        formdata.append('sim_numbers', plan.text);
        {
          plan?.sim_imeis && formdata.append('sim_imeis', plan.sim_imeis);
        }
        plan.hasOwnProperty('zip_code') && formdata.append('zip_code', plan.zip_code);
      }
      if (plan.type == 'standard_recurring_plan') {
        for (let i = 0; i < plan.qty; i++) formdata.append(`orders[${i}][plan_id]`, plan.plan_id);
      }
    }

    //  let i=0;
    //   for(let j=0 ; j<itemsArray.filter(obj=>obj.type=="standard_recurring_plan").length ;j++)
    //   {

    //         const k=i+parseInt(itemsArray.filter(obj=>obj.type=="standard_recurring_plan")[j].qty);

    //         while(i<k)
    //         {

    //           formdata.append(`orders[${i}][plan_id]`, itemsArray.filter(obj=>obj.type=="standard_recurring_plan")[j].plan_id);
    //           i++;
    //         }

    // }

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order-item/add`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function forgotpassword(identifier) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('identifier', identifier);
    formdata.append('from_bulk_order', true);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}forgot-password`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function resetpassword(token, password) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('token', token);
    formdata.append('password', password);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}reset-password`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function updateShippingOnOrder(shipping, orderhash) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    var formdata = new FormData();
    var formdata = new FormData();
    formdata.append('order_hash', orderhash);
    formdata.append('customer_id', user.id);
    formdata.append('shipping_fname', shipping.firstname);
    formdata.append('shipping_lname', shipping.lastname);
    formdata.append('shipping_address1', shipping.streetaddress);
    formdata.append('shipping_address2', shipping.streetaddress2);
    formdata.append('shipping_zip', shipping.zipcode);
    formdata.append('shipping_city', shipping.city);
    formdata.append('shipping_state_id', shipping.state);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order/shipping-details/update`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function updateBillingOnOrder(billing, orderhash) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('order_hash', orderhash);
    formdata.append('customer_id', user.id);
    formdata.append('billing_fname', billing.firstname);
    formdata.append('billing_lname', billing.lastname);
    formdata.append('billing_address1', billing.streetaddress);
    formdata.append('billing_address2', billing.streetaddress2);
    formdata.append('billing_zip', billing.zipcode);
    formdata.append('billing_city', billing.city);
    formdata.append('billing_state_id', billing.state);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order/shipping-details/update`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function getPendingOrderHash(type) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));

    const formdata = new FormData();
    formdata.append('order_type', type);
    formdata.append('customer_id', user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/get-recent-pending-order`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function validateSims(type, order_id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    type.customer_id = user.id;
    type.order_id = order_id;

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(type),
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/validate-sims`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function createCustomer(obj, hash, referral_code) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    // type.customer_id = user.id;
    // var formdata = new FormData();
    // formdata.append("order_type", type);
    // formdata.append("customer_id", user.id);
    obj.order_hash = hash;
    if (referral_code) obj.referral_code = referral_code;
    delete obj.acceptTermsConditions;
    delete obj.passwordConfirm;
    const billingData = {
      billing_address1: obj.billing_address1,
      billing_address2: obj.billing_address2,
      billing_city: obj.billing_city,
      billing_fname: obj.billing_fname,
      billing_lname: obj.billing_lname,
      billing_state_id: obj.billing_state_id,
      billing_zip: obj.billing_zip,
    };
    delete obj.billing_address1;
    delete obj.billing_address2;
    delete obj.billing_city;
    delete obj.billing_fname;
    delete obj.billing_lname;
    delete obj.billing_state_id;
    delete obj.billing_zip;
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}create-customer`, requestOptions)
      .then((response) => response.json())
      .then((result2) => {
        if (result2?.error) {
          reject(result2.error);
        }
        billingData.id = result2.customer.id;
        const requestOptions2 = {
          method: 'POST',
          headers: myHeaders,
          body: JSON.stringify(billingData),
          redirect: 'follow',
        };
        fetch(`${url}create-customer`, requestOptions2)
          .then((response) => response.json())
          .then((result) => {
            resolve({ ...result, id: result2.customer.id });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function createCustomerUpdated(obj, referral_code) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    if (referral_code) obj.referral_code = referral_code;
    delete obj.acceptTermsConditions;
    delete obj.passwordConfirm;
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/customer`, requestOptions)
      .then((response) => response.json())
      .then((result2) => {
        if (result2?.error) {
          reject(result2.error);
        }

        resolve(result2);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
export function getHash() {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    // type.customer_id = user.id;
    // console.log(type)
    // var formdata = new FormData();
    // formdata.append("order_type", type);
    // formdata.append("customer_id", user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify({}),
      redirect: 'follow',
    };

    fetch(`${url}order`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function submitPortInformation(obj) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    // type.customer_id = user.id
    // var formdata = new FormData();
    // formdata.append("order_type", type);
    // formdata.append("customer_id", user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/update-order-group`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getUltraSimStatus(obj) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    // type.customer_id = user.id;
    // var formdata = new FormData();
    // formdata.append("order_type", type);
    // formdata.append("customer_id", user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}get-ultra-line-status`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function pauseUnPauseUltraLines(obj) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    // type.customer_id = user.id;
    // var formdata = new FormData();
    // formdata.append("order_type", type);
    // formdata.append("customer_id", user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}pause-unpause-ultra-line`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function addCustomerProduct(obj) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    // type.customer_id = user.id;
    // var formdata = new FormData();
    // formdata.append("order_type", type);
    // formdata.append("customer_id", user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}add-customer-products`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function submitOrder(obj) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    // type.customer_id = user.id;
    // console.log(type)
    // var formdata = new FormData();
    // formdata.append("order_type", type);
    // formdata.append("customer_id", user.id);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: JSON.stringify(obj),
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/order-items`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getplans(id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('sim_id', id);
    formdata.append('customer_id', user.id);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}bulk-order/sims-plan-list`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function verifyDynamicUrl(id) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    const user = JSON.parse(secureLocalStorage.getItem('user_token'));
    const formdata = new FormData();
    formdata.append('dynamic_url', id);
    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}verify-dynamic-url`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        reject(error);
        console.warn(error);
      });
  });
}

export function getVtmobileSimInfo(phone_number) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    fetch(
      `${url}vtmobile/sim-info?phone_number=${phone_number}`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function vtmobilePause({ msisdn, effective_date }) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('lines[0][msisdn]', msisdn);
    formdata.append('effective_date', effective_date);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}vtmobile/pause`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}

export function vtmobileUnpause({ msisdn, effective_date, plan_id, plan_name }) {
  return new Promise((resolve, reject) => {
    const myHeaders = new Headers();
    myHeaders.append('AccessToken', 'key');
    myHeaders.append('Authorization', auth);

    const formdata = new FormData();
    formdata.append('lines[0][msisdn]', msisdn);
    formdata.append('effective_date', effective_date);
    formdata.append('plan_id', plan_id);
    formdata.append('plan_name', plan_name);

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    fetch(`${url}vtmobile/unpause`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        resolve(result);
      })
      .catch((error) => {
        resolve(error);
      });
  });
}
