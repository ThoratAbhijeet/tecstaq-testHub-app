import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

 baseUrl = environment.baseUrl
  constructor(private http: HttpClient) { }
  //Student list
  getStudentList(key: any, page: any, perPage: any): Observable<any> {
    let params: any = {
      page: page,
      perPage: perPage,
      key: key
    };
    // Check if page or perPage is empty and remove them from params if so
    if (page === '' || perPage === '') {
      delete params.page;
      delete params.perPage;
    }
    if (key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/student', {
      params: params
    });

  }
  //add new Student...
  addStudent(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/student', data);
  }
  //update Student...
  editStudent(id: any, data: any,): Observable<any> {
    return this.http.put(this.baseUrl + 'api/student/' + id, data);
  }
  //Student get by id ...
  getStudentById(id: any) {
    return this.http.get(this.baseUrl + 'api/student/' + id)
  }
  // Student enable disable
  StudentEnableDisable(id: any, status: any,): Observable<any> {
    const body = { status: status };
    let params = new HttpParams().set('status', status);
    return this.http.patch(this.baseUrl + 'api/student/' + id, body, {
      params: params
    });
  }
   // Student approve
  StudentApprove(id: any, is_approved: any,): Observable<any> {
    const body = { is_approved: is_approved };
    let params = new HttpParams().set('is_approved', is_approved);
    return this.http.patch(this.baseUrl + 'api/student/student-approve/' + id, body, {
      params: params
    });
  }
    //get Student wma ....................................................
  getAllStudentListWma(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/student/wma')
  }

    //Group list
  getGroupList(key: any, page: any, perPage: any): Observable<any> {
    let params: any = {
      page: page,
      perPage: perPage,
      key: key
    };
    // Check if page or perPage is empty and remove them from params if so
    if (page === '' || perPage === '') {
      delete params.page;
      delete params.perPage;
    }
    if (key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/group', {
      params: params
    });

  }
  //add new Group...
  addGroup(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/group', data);
  }
  //update Group...
  editGroup(id: any, data: any,): Observable<any> {
    return this.http.put(this.baseUrl + 'api/group/' + id, data);
  }
  //Group get by id ...
  getGroupById(id: any) {
    return this.http.get(this.baseUrl + 'api/group/' + id)
  }
  // Group enable disable
  GroupEnableDisable(id: any, status: any,): Observable<any> {
    const body = { status: status };
    let params = new HttpParams().set('status', status);
    return this.http.patch(this.baseUrl + 'api/group/' + id, body, {
      params: params
    });
  }
    //get Group wma ....................................................
  getAllGroupListWma(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/group/wma')
  }
   //Test list
  getTestList(key: any, page: any, perPage: any): Observable<any> {
    let params: any = {
      page: page,
      perPage: perPage,
      key: key
    };
    // Check if page or perPage is empty and remove them from params if so
    if (page === '' || perPage === '') {
      delete params.page;
      delete params.perPage;
    }
    if (key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/test', {
      params: params
    });

  }
  //add new Test...
  addTest(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/test', data);
  }
  //update Test...
  editTest(id: any, data: any,): Observable<any> {
    return this.http.put(this.baseUrl + 'api/test/' + id, data);
  }
  //Test get by id ...
  getTestById(id: any) {
    return this.http.get(this.baseUrl + 'api/test/' + id)
  }
  // Test enable disable
  TestEnableDisable(id: any, status: any,): Observable<any> {
    const body = { status: status };
    let params = new HttpParams().set('status', status);
    return this.http.patch(this.baseUrl + 'api/test/' + id, body, {
      params: params
    });
  }
    //get Test wma ....................................................
  getAllTestListWma(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/test/wma')
  }
     //QuetionType list
  getQuetionTypeList(key: any, page: any, perPage: any): Observable<any> {
    let params: any = {
      page: page,
      perPage: perPage,
      key: key
    };
    // Check if page or perPage is empty and remove them from params if so
    if (page === '' || perPage === '') {
      delete params.page;
      delete params.perPage;
    }
    if (key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/quetion_type', {
      params: params
    });

  }
  //add new QuetionType...
  addQuetionType(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/quetion_type', data);
  }
  //update QuetionType...
  editQuetionType(id: any, data: any,): Observable<any> {
    return this.http.put(this.baseUrl + 'api/quetion_type/' + id, data);
  }
  //QuetionType get by id ...
  getQuetionTypeById(id: any) {
    return this.http.get(this.baseUrl + 'api/quetion_type/' + id)
  }
  // QuetionType enable disable
  QuetionTypeEnableDisable(id: any, status: any,): Observable<any> {
    const body = { status: status };
    let params = new HttpParams().set('status', status);
    return this.http.patch(this.baseUrl + 'api/quetion_type/' + id, body, {
      params: params
    });
  }
    //get QuetionType wma ....................................................
  getAllQuetionTypeListWma(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/quetion_type/wma')
  }
   //Questionnaire list
  getQuestionnaireList(key: any, page: any, perPage: any): Observable<any> {
    let params: any = {
      page: page,
      perPage: perPage,
      key: key
    };
    // Check if page or perPage is empty and remove them from params if so
    if (page === '' || perPage === '') {
      delete params.page;
      delete params.perPage;
    }
    if (key === '' || key === 'null') delete params.key;
    return this.http.get(this.baseUrl + 'api/questionnaire', {
      params: params
    });

  }
  //add new Questionnaire...
  addQuestionnaire(data: any): Observable<any> {
    return this.http.post(this.baseUrl + 'api/questionnaire', data);
  }
  //update Questionnaire...
  editQuestionnaire(id: any, data: any,): Observable<any> {
    return this.http.put(this.baseUrl + 'api/questionnaire/' + id, data);
  }
  //Questionnaire get by id ...
  getQuestionnaireById(id: any) {
    return this.http.get(this.baseUrl + 'api/questionnaire/' + id)
  }
  // Questionnaire enable disable
  QuestionnaireEnableDisable(id: any, status: any,): Observable<any> {
    const body = { status: status };
    let params = new HttpParams().set('status', status);
    return this.http.patch(this.baseUrl + 'api/questionnaire/' + id, body, {
      params: params
    });
  }
    //get Questionnaire wma ....................................................
  getAllQuestionnaireListWma(): Observable<any> {
    return this.http.get(this.baseUrl + 'api/questionnaire/wma')
  }
}
