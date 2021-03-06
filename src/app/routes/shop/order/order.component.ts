import { UserLoginComponent } from './../../passport/login/login.component';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import swal, { SweetAlertType } from 'sweetalert2';
import { ShopService } from '../shop.service';
import { SettingsService } from '@delon/theme';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styles: []
})
export class OrderComponent implements OnInit {

  list1: any = [];
  list2 = [];
  list3 = [];
  list4 = [];
  query: any = {};
  Form: any;
  showModal = false;

  constructor(private service: ShopService, public settings: SettingsService, private fb: FormBuilder, private http: HttpClient, public msg: NzMessageService) { }

  ngOnInit() {
    this.Form = this.fb.group({
      shopId: [null],
      userName: [null],
      orderId: [null],
      number: 0,
      content: [null]
    });
    this.load();
  }

  load() {
    this.list2 = [];
    this.list3 = [];
    this.list4 = [];
    this.query.userId = this.settings.user.userId;
    this.service.postFn('/order/query', this.query).subscribe((res: any) => {
      if(res.success) {
          this.list1 = res.info;
          for (let i = 0; i < res.info.length; i++) {
            if (res.info[i].status === 1) {
              this.list2.push(res.info[i]);
            }
            if (res.info[i].status === 2) {
              this.list3.push(res.info[i]);
            }
            if (res.info[i].status === 3 || res.info[i].status === 4) {
              this.list4.push(res.info[i]);
            }
          }
      }else {
          this.list1 = res.info;
          this.msg.error('查询失败!');
      }
    });
  }

  /** 确认收货 */
  confirmFn(data) {
    this.service.postFn('/order/confirm', data).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.load();
      } else {
        this.msg.error(res.message);
      }
    });
  }

  /** 评价 */
  judgeFn(data) {
    const params = {
      shopId: data.shopId,
      orderId: data.orderId,
      userName: this.settings.user.username,
    }
    this.Form.patchValue(params);
    this.showModal = true;
  }

  handleCancel() {
    this.showModal = false;
    this.Form.reset();
  }

  handleOk() {
    const params:any = this.Form.getRawValue();
    params.date = new Date();
    this.service.postFn('/order/judge', params).subscribe((res: any) => {
      if (res.success) {
        this.msg.success(res.message);
        this.load();
      } else {
        this.msg.error(res.message);
      }
    });

    this.Form.reset();
    this.showModal = false;
  }
}
