import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OpenpayService {
  constructor(private configService: ConfigService) {}

  async createOrder() {
    const options = {
      method: 'POST',
      url: 'https://api.training.myopenpay.com.au/v1/merchant/orders',
      headers: {
        accept: 'application/json',
        'openpay-version': '1.20210320',
        'content-type': 'application/json',
        authorization:
          'Basic MzI4NToxMkU1QUMxRi1FRjNBLTQyRDYtQUU3Mi1DNjdCQUVFRjNBRTk=',
      },
      data: {
        customerJourney: {
          origin: 'Online',
          online: {
            failUrl: 'http://localhost:3000/openpay/failed',
            cancelUrl: 'http://localhost:3000/openpay/cancel',
            callbackUrl: 'http://localhost:5000/openpay/callback',
            planCreationType: 'Pending',
            deliveryMethod: 'Delivery',
            customerDetails: {
              firstName: 'Tester',
              familyName: 'Smith',
              email: 'AppTestUser@xx.yy',
              dateOfBirth: '15 Oct 1984',
              gender: 'M',
              residentialAddress: {
                line1: '1 Sydney Street',
                suburb: 'Sydney',
                state: 'NSW',
                postCode: '2000',
              },
              deliveryAddress: {
                line1: '1 Sydney Street',
                suburb: 'Sydney',
                state: 'NSW',
                postCode: '2000',
              },
            },
          },
        },
        goodsDescription: 'Electronics',
        purchasePrice: 100,
        retailerOrderNo: 'INV1234',
        source: 'Openpay Dev Center',
      },
    };

    const data = await axios
      .request(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error.response.data.errors);
      });

    console.log(data);

    return {
      url: `${data.nextAction.formPost.formPostUrl}?TransactionToken=${data.nextAction.formPost.formFields[0].fieldValue}`,
    };
  }

  async getStatus(orderId: string) {
    const options = {
      method: 'GET',
      url: `https://api.training.myopenpay.com.au/v1/merchant/orders/${orderId}`,
      headers: {
        accept: 'application/json',
        'openpay-version': '1.20210320',
        'content-type': 'application/json',
        authorization:
          'Basic My0zNzM6MTgwRDczMUEtRjlDOC00MzdCLThGQzAtODM0MTE5NkQ5Q0Yw',
      },
    };

    const data = await axios
      .request(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error.response.data.errors);
      });

    return data;
  }

  async captureOrder(orderId: string) {
    const options = {
      method: 'POST',
      url: 'https://api.training.myopenpay.com.au/v1/merchant/orders/3000000132734/capturepayment',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'openpay-version': '1.20210320',
        authorization:
          'Basic My0zNzM6MTgwRDczMUEtRjlDOC00MzdCLThGQzAtODM0MTE5NkQ5Q0Yw',
      },
    };

    const data = await axios
      .request(options)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
      });

    return data;
  }
}
