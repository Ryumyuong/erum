/**
 * 약관/방침 본문. 사이트명·회사명·연락처·시행일은 인자로 받아 치환하고,
 * locale("ko" | 그 외=영문)에 따라 한국어/영어 본문을 반환한다.
 */

export function termsText(
  siteName: string,
  effectiveDate: string,
  locale: string,
): string {
  if (locale !== "ko") return termsEn(siteName, effectiveDate);
  return `제1조 목적

본 이용약관은 ${siteName}(이하 "사이트")의 서비스의 이용조건과 운영에 관한 제반 사항 규정을 목적으로 합니다.

제2조 용어의 정의

본 약관에서 사용되는 주요한 용어의 정의는 다음과 같습니다.
① 회원 : 사이트의 약관에 동의하고 개인정보를 제공하여 회원등록을 한 자로서, 사이트와의 이용계약을 체결하고 사이트를 이용하는 이용자를 말합니다.
② 이용계약 : 사이트 이용과 관련하여 사이트와 회원간에 체결 하는 계약을 말합니다.
③ 회원 아이디(이하 "ID") : 회원의 식별과 회원의 서비스 이용을 위하여 회원별로 부여하는 고유한 문자와 숫자의 조합을 말합니다.
④ 비밀번호 : 회원이 부여받은 ID와 일치된 회원임을 확인하고 회원의 권익 보호를 위하여 회원이 선정한 문자와 숫자의 조합을 말합니다.
⑤ 운영자 : 서비스에 홈페이지를 개설하여 운영하는 운영자를 말합니다.
⑥ 해지 : 회원이 이용계약을 해약하는 것을 말합니다.

제3조 약관 외 준칙

운영자는 필요한 경우 별도로 운영정책을 공지 안내할 수 있으며, 본 약관과 운영정책이 중첩될 경우 운영정책이 우선 적용됩니다.

제4조 이용계약 체결

① 이용계약은 회원으로 등록하여 사이트를 이용하려는 자의 본 약관 내용에 대한 동의와 가입신청에 대하여 운영자의 이용승낙으로 성립합니다.
② 회원으로 등록하여 서비스를 이용하려는 자는 사이트 가입신청 시 본 약관을 읽고 아래에 있는 "동의합니다"를 선택하는 것으로 본 약관에 대한 동의 의사 표시를 합니다.

제5조 서비스 이용 신청

① 회원으로 등록하여 사이트를 이용하려는 이용자는 사이트에서 요청하는 제반정보(이용자ID, 비밀번호, 닉네임 등)를 제공해야 합니다.
② 타인의 정보를 도용하거나 허위의 정보를 등록하는 등 본인의 진정한 정보를 등록하지 않은 회원은 사이트 이용과 관련하여 아무런 권리를 주장할 수 없으며, 관계 법령에 따라 처벌받을 수 있습니다.

제6조 개인정보처리방침

사이트 및 운영자는 회원가입 시 제공한 개인정보 중 비밀번호를 가지고 있지 않으며 이와 관련된 부분은 사이트의 개인정보처리방침을 따릅니다.
운영자는 관계 법령이 정하는 바에 따라 회원등록정보를 포함한 회원의 개인정보를 보호하기 위하여 노력합니다.
회원의 개인정보보호에 관하여 관계법령 및 사이트가 정하는 개인정보처리방침에 정한 바에 따릅니다.
단, 회원의 귀책 사유로 인해 노출된 정보에 대해 운영자는 일체의 책임을 지지 않습니다.
운영자는 회원이 미풍양속에 저해되거나 국가안보에 위배되는 게시물 등 위법한 게시물을 등록·배포할 경우 관련 기관의 요청이 있을 시 회원의 자료를 열람 및 해당 자료를 관련 기관에 제출할 수 있습니다.

제7조 운영자의 의무

① 운영자는 이용회원으로부터 제기되는 의견이나 불만이 정당하다고 인정할 경우에는 가급적 빨리 처리하여야 합니다. 다만, 개인적인 사정으로 신속한 처리가 곤란한 경우에는 사후에 공지 또는 이용회원에게 쪽지, 전자우편 등을 보내는 등 최선을 다합니다.
② 운영자는 계속적이고 안정적인 사이트 제공을 위하여 설비에 장애가 생기거나 유실된 때에는 이를 지체 없이 수리 또는 복구할 수 있도록 사이트에 요구할 수 있습니다. 다만, 천재지변 또는 사이트나 운영자에 부득이한 사유가 있는 경우, 사이트 운영을 일시 정지할 수 있습니다.

제8조 회원의 의무

① 회원은 본 약관에서 규정하는 사항과 운영자가 정한 제반 규정, 공지사항 및 운영정책 등 사이트가 공지하는 사항 및 관계 법령을 준수하여야 하며, 기타 사이트의 업무에 방해가 되는 행위, 사이트의 명예를 손상하는 행위를 해서는 안 됩니다.
② 회원은 사이트의 명시적 동의가 없는 한 서비스의 이용 권한, 기타 이용계약상 지위를 타인에게 양도, 증여할 수 없으며, 이를 담보로 제공할 수 없습니다.
③ 이용고객은 아이디 및 비밀번호 관리에 상당한 주의를 기울여야 하며, 운영자나 사이트의 동의 없이 제3자에게 아이디를 제공하여 이용하게 할 수 없습니다.
④ 회원은 운영자와 사이트 및 제3자의 지적 재산권을 침해해서는 안 됩니다.

제9조 서비스 이용 시간

① 서비스 이용 시간은 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴 1일 24시간을 원칙으로 합니다. 단, 사이트는 시스템 정기점검, 증설 및 교체를 위해 사이트가 정한 날이나 시간에 서비스를 일시중단 할 수 있으며 예정된 작업으로 인한 서비스 일시 중단은 사이트의 홈페이지에 사전에 공지하오니 수시로 참고하시길 바랍니다.
② 단, 사이트는 다음 경우에 대하여 사전 공지나 예고 없이 서비스를 일시적 혹은 영구적으로 중단할 수 있습니다.
- 긴급한 시스템 점검, 증설, 교체, 고장 혹은 오동작을 일으키는 경우
- 국가비상사태, 정전, 천재지변 등의 불가항력적인 사유가 있는 경우
- 전기통신사업법에 규정된 기간통신사업자가 전기통신 서비스를 중지한 경우
- 서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우
③ 전항에 의한 서비스 중단의 경우 사이트는 사전에 공지사항 등을 통하여 회원에게 통지합니다. 단, 사이트가 통제할 수 없는 사유로 발생한 서비스의 중단에 대하여 사전공지가 불가능한 경우에는 사후공지로 대신합니다.

제10조 서비스 이용 해지

① 회원이 사이트와의 이용계약을 해지하고자 하는 경우에는 회원 본인이 온라인을 통하여 등록해지 신청을 하여야 합니다. 한편, 사이트 이용 해지와 별개로 사이트에 대한 이용계약 해지는 별도로 하셔야 합니다.
② 해지 신청과 동시에 사이트가 제공하는 사이트 관련 프로그램이 회원 관리 화면에서 자동적으로 삭제됨으로 운영자는 더 이상 해지신청자의 정보를 볼 수 없습니다.

제11조 서비스 이용 제한

회원은 다음 각호에 해당하는 행위를 하여서는 아니 되며 해당 행위를 한 경우에 사이트는 회원의 서비스 이용 제한 및 적법한 조치를 할 수 있으며 이용계약을 해지하거나 기간을 정하여 서비스를 중지할 수 있습니다.
① 회원 가입시 혹은 가입 후 정보 변경 시 허위 내용을 등록하는 행위
② 타인의 사이트 이용을 방해하거나 정보를 도용하는 행위
③ 사이트의 운영진, 직원 또는 관계자를 사칭하는 행위
④ 사이트, 기타 제3자의 인격권 또는 지적재산권을 침해하거나 업무를 방해하는 행위
⑤ 다른 회원의 ID를 부정하게 사용하는 행위
⑥ 다른 회원에 대한 개인정보를 그 동의 없이 수집, 저장, 공개하는 행위
⑦ 범죄와 결부된다고 객관적으로 판단되는 행위
⑧ 기타 관련 법령에 위배되는 행위

제12조 게시물의 관리

① 사이트의 게시물과 자료의 관리 및 운영의 책임은 운영자에게 있습니다. 운영자는 항상 불량 게시물 및 자료에 대하여 모니터링을 하여야 하며, 불량 게시물 및 자료를 발견하거나 신고를 받으면 해당 게시물 및 자료를 삭제하고 이를 등록한 회원에게 주의를 주어야 합니다. 한편, 이용회원이 올린 게시물에 대해서는 게시자 본인에게 책임이 있으니 회원 스스로 본 이용약관에서 위배되는 게시물은 게재해서는 안 됩니다.
② 정보통신윤리위원회 등 공공기관의 시정요구가 있는 경우 운영자는 회원의 사전동의 없이 게시물을 삭제하거나 이동 할 수 있습니다.
③ 불량게시물의 판단기준은 다음과 같습니다.
- 다른 회원 또는 제3자에게 심한 모욕을 주거나 명예를 손상하는 내용인 경우
- 공공질서 및 미풍양속에 위반되는 내용을 유포하거나 링크 시키는 경우
- 불법 복제 또는 해킹을 조장하는 내용인 경우
- 영리를 목적으로 하는 광고일 경우
- 범죄와 결부된다고 객관적으로 인정되는 내용일 경우
- 다른 이용자 또는 제3자와 저작권 등 기타 권리를 침해하는 경우
- 기타 관계 법령에 위배된다고 판단되는 경우
④ 사이트 및 운영자는 게시물 등에 대하여 제3자로부터 명예훼손, 지적재산권 등의 권리 침해를 이유로 게시중단 요청을 받은 경우 이를 임시로 게시 중단(전송중단)할 수 있으며, 게시중단 요청자와 게시물 등록자 간에 소송, 합의 기타 이에 준하는 관련 기관의 결정 등이 이루어져 사이트에 접수된 경우 이에 따릅니다.

제13조 게시물의 보관

사이트 운영자가 불가피한 사정으로 본 사이트를 중단하게 될 경우, 회원에게 사전 공지를 하고 게시물의 이전이 쉽도록 모든 조치를 하기 위해 노력합니다.

제14조 게시물에 대한 저작권

① 회원이 사이트 내에 게시한 게시물의 저작권은 게시한 회원에게 귀속됩니다. 또한 사이트는 게시자의 동의 없이 게시물을 상업적으로 이용할 수 없습니다. 다만 비영리 목적인 경우는 그러하지 아니하며, 또한 서비스 내의 게재권을 갖습니다.
② 회원은 서비스를 이용하여 취득한 정보를 임의 가공, 판매하는 행위 등 서비스에 게재된 자료를 상업적으로 사용할 수 없습니다.
③ 운영자는 회원이 게시하거나 등록하는 사이트 내의 내용물, 게시 내용에 대해 제12조 각호에 해당한다고 판단되는 경우 사전통지 없이 삭제하거나 이동 또는 등록 거부할 수 있습니다.

제15조 손해배상

① 본 사이트의 발생한 모든 민, 형법상 책임은 회원 본인에게 1차적으로 있습니다.
② 본 사이트로부터 회원이 받은 손해가 천재지변 등 불가항력적이거나 회원의 고의 또는 과실로 인하여 발생한 때에는 손해배상을 하지 않습니다.

제16조 면책

① 운영자는 회원이 사이트의 서비스 제공으로부터 기대되는 이익을 얻지 못하였거나 서비스 자료에 대한 취사선택 또는 이용으로 발생하는 손해 등에 대해서는 책임이 면제됩니다.
② 운영자는 본 사이트의 서비스 기반 및 타 통신업자가 제공하는 전기통신 서비스의 장애로 인한 경우에는 책임이 면제되며 본 사이트의 서비스 기반과 관련되어 발생한 손해에 대해서는 사이트의 이용약관에 준합니다.
③ 운영자는 회원이 저장, 게시 또는 전송한 자료와 관련하여 일체의 책임을 지지 않습니다.
④ 운영자는 회원의 귀책 사유로 인하여 서비스 이용의 장애가 발생한 경우에는 책임지지 아니합니다.
⑤ 운영자는 회원 상호 간 또는 회원과 제3자 상호 간, 기타 회원의 본 서비스 내외를 불문한 일체의 활동(데이터 전송, 기타 커뮤니티 활동 포함)에 대하여 책임을 지지 않습니다.
⑥ 운영자는 회원이 게시 또는 전송한 자료 및 본 사이트로 회원이 제공받을 수 있는 모든 자료들의 진위, 신뢰도, 정확성 등 그 내용에 대해서는 책임지지 아니합니다.
⑦ 운영자는 회원 상호 간 또는 회원과 제3자 상호 간에 서비스를 매개로 하여 물품거래 등을 한 경우에 그로부터 발생하는 일체의 손해에 대하여 책임지지 아니합니다.
⑧ 운영자는 운영자의 귀책 사유 없이 회원간 또는 회원과 제3자간에 발생한 일체의 분쟁에 대하여 책임지지 아니합니다.
⑨ 운영자는 서버 등 설비의 관리, 점검, 보수, 교체 과정 또는 소프트웨어의 운용 과정에서 고의 또는 고의에 준하는 중대한 과실 없이 발생할 수 있는 시스템의 장애, 제3자의 공격으로 인한 시스템의 장애, 국내외의 저명한 연구기관이나 보안 관련 업체에 의해 대응 방법이 개발되지 아니한 컴퓨터 바이러스 등의 유포나 기타 운영자가 통제할 수 없는 불가항력적 사유로 인한 회원의 손해에 대하여 책임지지 않습니다.

부칙

이 약관은 ${effectiveDate}부터 시행합니다.`;
}

function termsEn(siteName: string, effectiveDate: string): string {
  return `Article 1 Purpose

These Terms of Service set out the conditions of use and operational matters for the services of ${siteName} (the "Site").

Article 2 Definitions

The key terms used in these Terms are defined as follows.
1. Member: a user who agrees to the Site's terms, provides personal information to register, enters into a service agreement with the Site, and uses the Site.
2. Service Agreement: the agreement entered into between the Site and a Member in connection with use of the Site.
3. Member ID ("ID"): a unique combination of letters and numbers assigned to each Member to identify the Member and enable use of the service.
4. Password: a combination of letters and numbers chosen by the Member to confirm that the Member matches the assigned ID and to protect the Member's interests.
5. Operator: the operator who establishes and runs the website providing the service.
6. Termination: a Member's cancellation of the Service Agreement.

Article 3 Rules Outside These Terms

The Operator may separately announce operating policies as needed, and where these Terms and an operating policy overlap, the operating policy shall take precedence.

Article 4 Formation of the Service Agreement

1. The Service Agreement is formed by the consent of a person who registers as a Member and wishes to use the Site to the content of these Terms, together with the Operator's acceptance of the application.
2. A person who registers as a Member to use the service indicates consent to these Terms by reading them at the time of application and selecting "I Agree" below.

Article 5 Application for Service Use

1. A user who registers as a Member to use the Site must provide the information requested by the Site (user ID, password, nickname, etc.).
2. A Member who fails to register genuine information, such as by stealing another person's information or registering false information, may not assert any rights in connection with use of the Site and may be punished under applicable law.

Article 6 Privacy Policy

The Site and the Operator do not hold the password among the personal information provided at registration, and related matters follow the Site's Privacy Policy.
The Operator endeavors to protect Members' personal information, including registration information, in accordance with applicable law.
Protection of Members' personal information follows applicable law and the Privacy Policy established by the Site.
However, the Operator bears no responsibility for information exposed due to reasons attributable to the Member.
Where a Member registers or distributes unlawful content that harms public morals or violates national security, the Operator may, upon request of relevant authorities, review the Member's data and submit it to such authorities.

Article 7 Obligations of the Operator

1. Where the Operator deems an opinion or complaint raised by a Member to be justified, it shall handle it as promptly as possible. If prompt handling is difficult due to personal circumstances, the Operator shall do its best by subsequently posting a notice or sending a message or email to the Member.
2. To provide a continuous and stable Site, the Operator may require the Site to repair or restore facilities without delay when they fail or are lost. However, the Operator may temporarily suspend operation of the Site in cases of force majeure or unavoidable reasons relating to the Site or Operator.

Article 8 Obligations of the Member

1. Members shall comply with these Terms, the various rules, notices, and operating policies set by the Operator, matters announced by the Site, and applicable law, and shall not engage in acts that interfere with the Site's operations or harm the Site's reputation.
2. Without the Site's express consent, Members may not transfer or gift their right to use the service or other status under the Service Agreement to a third party, nor offer it as collateral.
3. Members must exercise considerable care in managing their ID and password, and may not allow a third party to use their ID without the consent of the Operator or the Site.
4. Members shall not infringe the intellectual property rights of the Operator, the Site, or any third party.

Article 9 Service Hours

1. Service is in principle available 24 hours a day, year-round, unless there are special operational or technical issues. However, the Site may temporarily suspend service on dates or times set by the Site for regular inspection, expansion, or replacement of systems; suspensions due to scheduled work will be announced in advance on the Site, so please check periodically.
2. The Site may suspend service temporarily or permanently without prior notice in the following cases:
- Urgent system inspection, expansion, replacement, failure, or malfunction
- Force majeure such as national emergency, power outage, or natural disaster
- A telecommunications carrier under the Telecommunications Business Act suspending telecommunications services
- Disruption to normal service due to a surge in usage, etc.
3. In the case of suspension under the preceding paragraph, the Site will notify Members in advance through notices, etc. However, where advance notice is impossible due to reasons beyond the Site's control, subsequent notice will substitute.

Article 10 Termination of Service Use

1. A Member who wishes to terminate the Service Agreement with the Site must apply for de-registration online in person. Separately from termination of Site use, termination of the Service Agreement must be done separately.
2. Upon application for termination, the Site-related programs provided by the Site are automatically deleted from the member management screen, so the Operator can no longer view the applicant's information.

Article 11 Restrictions on Service Use

Members shall not engage in any of the following acts; where a Member does so, the Site may restrict the Member's service use and take lawful measures, and may terminate the Service Agreement or suspend service for a fixed period.
1. Registering false content at registration or when changing information thereafter
2. Interfering with others' use of the Site or stealing information
3. Impersonating the Site's operators, employees, or affiliates
4. Infringing the personal or intellectual property rights of the Site or any third party, or interfering with operations
5. Improperly using another Member's ID
6. Collecting, storing, or disclosing other Members' personal information without consent
7. Acts objectively deemed to be associated with a crime
8. Other acts in violation of applicable law

Article 12 Management of Postings

1. Responsibility for managing and operating the Site's postings and materials lies with the Operator. The Operator shall monitor for improper postings and materials at all times, and upon discovering or receiving a report of such, shall delete them and warn the Member who registered them. Members are responsible for the postings they upload and must not post content that violates these Terms.
2. Where a public agency such as the Information and Communications Ethics Committee requests correction, the Operator may delete or move postings without the Member's prior consent.
3. The criteria for improper postings are as follows:
- Content that severely insults or damages the reputation of another Member or third party
- Content distributing or linking material that violates public order or morals
- Content encouraging illegal copying or hacking
- Advertising for commercial purposes
- Content objectively recognized as associated with a crime
- Content infringing the copyright or other rights of another user or third party
- Other content deemed to violate applicable law
4. Where the Site or Operator receives a request to suspend a posting from a third party on grounds of defamation or infringement of intellectual property rights, it may temporarily suspend the posting (suspend transmission); where litigation, settlement, or an equivalent decision by a relevant authority between the requester and the poster is filed with the Site, the Site shall follow it.

Article 13 Retention of Postings

If the Operator must discontinue the Site for unavoidable reasons, it will notify Members in advance and endeavor to take all measures to facilitate the migration of postings.

Article 14 Copyright of Postings

1. Copyright in postings made by a Member on the Site belongs to the Member who posted them. The Site may not use postings commercially without the poster's consent, except for non-commercial purposes, and holds the right to display them within the service.
2. Members may not commercially use materials posted in the service, such as by processing or selling information obtained through the service.
3. Where the Operator deems content posted or registered by a Member to fall under any item of Article 12, it may delete, move, or refuse registration without prior notice.

Article 15 Damages

1. All civil and criminal liability arising on the Site lies primarily with the Member.
2. Where damage incurred by a Member from the Site results from force majeure such as a natural disaster, or from the Member's intent or negligence, no compensation will be made.

Article 16 Disclaimer

1. The Operator is exempt from liability for damages arising from a Member's failure to obtain expected benefits from the service, or from the Member's selection or use of service materials.
2. The Operator is exempt from liability for failures of the service infrastructure or of telecommunications services provided by other carriers; damages relating to the service infrastructure follow the Site's Terms of Service.
3. The Operator bears no liability regarding materials a Member stores, posts, or transmits.
4. The Operator bears no liability where service disruption arises due to reasons attributable to the Member.
5. The Operator bears no liability for any activity (including data transmission and other community activity) between Members or between a Member and a third party, whether within or outside the service.
6. The Operator bears no liability for the authenticity, reliability, or accuracy of materials posted or transmitted by Members and all materials a Member may receive through the Site.
7. The Operator bears no liability for any damage arising from transactions of goods, etc., conducted between Members or between a Member and a third party through the service.
8. The Operator bears no liability for any dispute arising between Members or between a Member and a third party without the Operator's fault.
9. The Operator bears no liability for a Member's damage caused by system failures that may occur without intent or gross negligence in managing, inspecting, repairing, or replacing equipment such as servers or operating software, system failures due to third-party attacks, distribution of computer viruses for which no countermeasure has been developed by renowned domestic or international research or security institutions, or other force majeure beyond the Operator's control.

Addendum

These Terms take effect from ${effectiveDate}.`;
}

export function privacyText(
  companyName: string,
  email: string,
  phone: string,
  effectiveDate: string,
  locale: string,
): string {
  if (locale !== "ko") return privacyEn(companyName, email, phone, effectiveDate);
  const contactLine = `연락처 : ${phone}, ${email}`;
  return `${companyName}(이하 '회사')는 개인정보 보호법 제30조에 따라 정보 주체의 개인정보를 보호하고 이와 관련한 고충을 신속하고 원활하게 처리할 수 있도록 하기 위하여 다음과 같이 개인정보 처리지침을 수립, 공개합니다.

제1조 (개인정보의 처리목적)

회사는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적 이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보보호법 제18조에 따라 별도의 동의를 받는 등 필요한 조치를 이행할 예정입니다.
1. 문의 및 견적 응대 : 견적 문의 접수·확인, 본인 식별, 상담 및 응대, 제작 상담 진행, 각종 고지·통지, 고충 처리 등을 목적으로 개인정보를 처리합니다.
2. 재화 또는 서비스 제공 : 맞춤 패키지 제작 상담, 계약 및 견적서 발송, 콘텐츠 제공, 본인인증 등을 목적으로 개인정보를 처리합니다.
3. 고충 처리 : 민원인의 신원 확인, 민원사항 확인, 사실조사를 위한 연락·통지, 처리 결과 통보 등의 목적으로 개인정보를 처리합니다.

제2조 (개인정보의 처리 및 보유기간)

① 회사는 법령에 따른 개인정보 보유, 이용 기간 또는 정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유, 이용 기간 내에서 개인정보를 처리, 보유합니다.
② 각각의 개인정보 처리 및 보유 기간은 다음과 같습니다.
1. 문의 및 견적 응대 : 문의·상담 종료 후 3년까지. 다만, 관계 법령 위반에 따른 수사·조사 등이 진행 중인 경우에는 해당 수사·조사 종료 시까지 보유합니다.
2. 재화 또는 서비스 제공 : 서비스 공급 완료 및 정산 완료 시까지. 다만, 다음의 사유에 해당하는 경우에는 해당 기간 종료 시까지 보유합니다.
- 계약 또는 청약 철회, 대금결제, 재화 등의 공급에 관한 기록 : 5년
- 소비자 불만 또는 분쟁 처리에 관한 기록 : 3년
- 표시·광고에 관한 기록 : 6개월

제3조 (개인정보의 제3자 제공)

① 회사는 정보주체의 개인정보를 제1조(개인정보의 처리목적)에서 명시한 범위 내에서만 처리하며, 정보주체의 동의, 법률의 특별한 규정 등 개인정보 보호법 제17조 및 제18조에 해당하는 경우에만 개인정보를 제3자에게 제공하고 그 외에는 정보주체의 개인정보를 제3자에게 제공하지 않습니다.
② 현재 회사는 정보주체의 개인정보를 제3자에게 제공하고 있지 않습니다. 향후 제공이 필요한 경우 제공받는 자, 이용목적, 제공 항목, 보유·이용기간을 사전에 고지하고 동의를 받겠습니다.

제4조 (개인정보처리의 위탁)

① 회사는 원활한 개인정보 업무처리를 위하여 필요한 범위에서 개인정보 처리업무를 외부 전문업체에 위탁할 수 있으며, 위탁 시 위탁받는 자와 위탁업무의 내용을 본 방침을 통해 공개합니다.
- 위탁받는 자(수탁자) : 클라우드 인프라(호스팅·데이터 저장) 제공업체
- 위탁하는 업무의 내용 : 웹사이트 호스팅, 문의 데이터 및 첨부파일 저장
② 회사는 위탁계약 체결 시 개인정보 보호법에 따라 위탁업무 수행목적 외 개인정보 처리금지, 기술적·관리적 보호조치, 재위탁 제한, 수탁자에 대한 관리·감독, 손해배상 등 책임에 관한 사항을 문서에 명시하고, 수탁자가 개인정보를 안전하게 처리하는지를 감독합니다.
③ 위탁업무의 내용이나 수탁자가 변경될 경우에는 지체없이 본 개인정보 처리방침을 통하여 공개하겠습니다.

제5조 (정보주체 및 법정대리인의 권리와 그 행사 방법)

① 정보주체는 회사에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
1. 개인정보 열람 요구
2. 오류 등이 있을 경우 정정 요구
3. 삭제 요구
4. 처리정지 요구
② 제1항에 따른 권리 행사는 회사에 대해 서면, 전화, 전자우편 등을 통하여 하실 수 있으며 회사는 이에 대해 지체없이 조치하겠습니다.
③ 정보주체가 개인정보의 오류 등에 대한 정정 또는 삭제를 요구한 경우에는 회사는 정정 또는 삭제를 완료할 때까지 당해 개인정보를 이용하거나 제공하지 않습니다.
④ 제1항에 따른 권리 행사는 정보주체의 법정대리인이나 위임을 받은 자 등 대리인을 통하여 하실 수 있습니다.
⑤ 정보주체는 개인정보 보호법 등 관계 법령을 위반하여 회사가 처리하고 있는 정보주체 본인이나 타인의 개인정보 및 사생활을 침해하여서는 아니 됩니다.

제6조 (처리하는 개인정보 항목)

회사는 다음의 개인정보 항목을 처리하고 있습니다.
1. 문의 및 견적 응대
필수항목 : 회사명/상호, 담당자명, 이메일, 연락처
선택항목 : 제품 정보, 수량, 디자인 링크, 첨부파일, 문의 내용
2. 자동 수집 항목
서비스 이용 과정에서 IP 주소, 쿠키, 접속 기록 등이 자동으로 생성·수집될 수 있습니다.

제7조 (개인정보의 파기)

① 회사는 개인정보 보유 기간의 경과, 처리목적 달성 등 개인정보가 불필요하게 되었을 때에는 지체없이 해당 개인정보를 파기합니다.
② 정보주체로부터 동의받은 개인정보 보유 기간이 경과하거나 처리목적이 달성되었음에도 불구하고 다른 법령에 따라 개인정보를 계속 보존하여야 하는 경우에는, 해당 개인정보를 별도의 데이터베이스(DB)로 옮기거나 보관장소를 달리하여 보존합니다.
③ 개인정보 파기의 절차 및 방법은 다음과 같습니다.
1. 파기 절차 : 회사는 파기 사유가 발생한 개인정보를 선정하고, 개인정보 보호책임자의 승인을 받아 파기합니다.
2. 파기 방법 : 전자적 파일 형태로 기록·저장된 개인정보는 재생할 수 없도록 파기하며, 종이 문서에 기록·저장된 개인정보는 분쇄하거나 소각하여 파기합니다.

제8조 (개인정보의 안전성 확보조치)

회사는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 하고 있습니다.
1. 관리적 조치 : 내부관리계획 수립 및 시행, 정기적 직원 교육 등
2. 기술적 조치 : 개인정보처리시스템 등의 접근 권한 관리, 접근통제시스템 설치, 고유 식별정보 등의 암호화, 보안프로그램 설치
3. 물리적 조치 : 전산실, 자료보관실 등의 접근통제

제9조 (개인정보 자동 수집 장치의 설치·운영 및 거부에 관한 사항)

① 회사는 이용자에게 개별적인 맞춤 서비스를 제공하기 위해 이용정보를 저장하고 수시로 불러오는 '쿠키(cookie)'를 사용합니다.
② 쿠키는 웹사이트를 운영하는데 이용되는 서버(http)가 이용자의 컴퓨터 브라우저에 보내는 소량의 정보이며 이용자들의 PC 또는 모바일에 저장됩니다.
③ 정보주체는 웹 브라우저 옵션 설정을 통해 쿠키 허용, 차단 등의 설정을 할 수 있습니다. 다만, 쿠키 저장을 거부할 경우 맞춤형 서비스 이용에 어려움이 발생할 수 있습니다.
▶ 웹 브라우저에서 쿠키 허용/차단
- 크롬(Chrome) : 설정 > 개인정보 보호 및 보안 > 인터넷 사용기록 삭제
- 엣지(Edge) : 설정 > 쿠키 및 사이트 권한 > 쿠키 및 사이트 데이터 관리 및 삭제

제10조 (개인정보 보호책임자)

① 회사는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의 불만 처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
▶ 개인정보 보호책임자
${contactLine}
② 정보주체께서는 회사의 서비스를 이용하시면서 발생한 모든 개인정보 보호 관련 문의, 불만 처리, 피해구제 등에 관한 사항을 개인정보 보호책임자에게 문의하실 수 있습니다. 회사는 정보주체의 문의에 대해 지체없이 답변 및 처리해드리겠습니다.

제11조 (개인정보 열람청구)

정보주체는 개인정보 보호법 제35조에 따른 개인정보의 열람 청구를 아래로 하실 수 있습니다. 회사는 정보주체의 개인정보 열람 청구가 신속하게 처리되도록 노력하겠습니다.
▶ 개인정보 열람청구 접수·처리
${contactLine}

제12조 (권익침해 구제 방법)

정보주체는 아래의 기관에 대해 개인정보 침해에 대한 피해구제, 상담 등을 문의하실 수 있습니다.
1. 개인정보 분쟁조정위원회 : (국번없이) 1833-6972 (www.kopico.go.kr)
2. 개인정보침해신고센터 : (국번없이) 118 (privacy.kisa.or.kr)
3. 대검찰청 : (국번없이) 1301 (www.spo.go.kr)
4. 경찰청 : (국번없이) 182 (ecrm.police.go.kr/minwon/main)

제13조 (개인정보 처리방침 시행 및 변경)

이 개인정보 처리방침은 ${effectiveDate}부터 적용됩니다.`;
}

function privacyEn(
  companyName: string,
  email: string,
  phone: string,
  effectiveDate: string,
): string {
  const contactLine = `Contact: ${phone}, ${email}`;
  return `${companyName} (the "Company") establishes and discloses the following personal information processing policy pursuant to Article 30 of the Personal Information Protection Act in order to protect the personal information of data subjects and to handle related grievances promptly and smoothly.

Article 1 (Purpose of Processing Personal Information)

The Company processes personal information for the following purposes. The personal information processed is not used for purposes other than the following, and where the purpose of use changes, the Company will take necessary measures such as obtaining separate consent under Article 18 of the Personal Information Protection Act.
1. Handling inquiries and quotes: receiving and confirming quote inquiries, identity verification, consultation and response, production consultation, various notices, and grievance handling.
2. Providing goods or services: custom packaging production consultation, sending contracts and quotations, providing content, and identity authentication.
3. Grievance handling: verifying the identity of complainants, confirming the details of complaints, contacting and notifying for fact-finding, and notifying results.

Article 2 (Processing and Retention Period of Personal Information)

1. The Company processes and retains personal information within the retention and use period under applicable law or the period consented to by the data subject at the time of collection.
2. The processing and retention period for each is as follows:
1. Handling inquiries and quotes: up to 3 years after the inquiry/consultation ends. However, where an investigation for violation of applicable law is in progress, until such investigation ends.
2. Providing goods or services: until completion of service provision and settlement. However, in the following cases, until the relevant period ends.
- Records on contracts or withdrawal of subscription, payment, and supply of goods: 5 years
- Records on consumer complaints or dispute handling: 3 years
- Records on labeling/advertising: 6 months

Article 3 (Provision of Personal Information to Third Parties)

1. The Company processes the data subject's personal information only within the scope specified in Article 1 (Purpose of Processing), and provides personal information to third parties only where Articles 17 and 18 of the Personal Information Protection Act apply, such as the data subject's consent or special provisions of law; otherwise it does not provide personal information to third parties.
2. The Company currently does not provide data subjects' personal information to third parties. If provision becomes necessary in the future, the Company will notify in advance and obtain consent regarding the recipient, purpose, items, and retention/use period.

Article 4 (Outsourcing of Personal Information Processing)

1. The Company may outsource personal information processing tasks to external specialized providers within the necessary scope for smooth processing, and discloses the outsourced party and the content of the outsourced work through this policy.
- Outsourced party (trustee): cloud infrastructure (hosting/data storage) provider
- Content of outsourced work: website hosting, storage of inquiry data and attachments
2. When entering into an outsourcing contract, the Company specifies in writing matters concerning prohibition of processing personal information beyond the purpose, technical and administrative protective measures, restrictions on re-outsourcing, supervision of the trustee, and liability for damages, in accordance with the Personal Information Protection Act, and supervises whether the trustee processes personal information safely.
3. If the content of the outsourced work or the trustee changes, the Company will disclose it through this policy without delay.

Article 5 (Rights of Data Subjects and Legal Representatives and How to Exercise Them)

1. A data subject may exercise the following rights regarding personal information protection against the Company at any time.
1. Request to access personal information
2. Request to correct errors
3. Request to delete
4. Request to suspend processing
2. The rights under paragraph 1 may be exercised against the Company in writing, by phone, or by email, and the Company will act on them without delay.
3. Where a data subject requests correction or deletion of errors in personal information, the Company will not use or provide the relevant personal information until correction or deletion is completed.
4. The rights under paragraph 1 may be exercised through the data subject's legal representative or an authorized agent.
5. A data subject must not infringe the personal information or privacy of themselves or others processed by the Company in violation of the Personal Information Protection Act or other applicable law.

Article 6 (Personal Information Items Processed)

The Company processes the following personal information items.
1. Handling inquiries and quotes
Required: company/business name, contact person name, email, phone number
Optional: product information, quantity, design link, attachments, inquiry content
2. Automatically collected items
IP address, cookies, access logs, etc. may be automatically generated and collected during use of the service.

Article 7 (Destruction of Personal Information)

1. When personal information becomes unnecessary due to the expiration of the retention period or achievement of the processing purpose, the Company destroys it without delay.
2. Where personal information must continue to be retained under other laws despite the expiration of the consented retention period or achievement of the purpose, the Company moves it to a separate database or stores it in a different location.
3. The procedure and method of destruction are as follows:
1. Procedure: the Company selects the personal information for which a reason for destruction has arisen and destroys it with the approval of the personal information protection officer.
2. Method: personal information recorded/stored in electronic file form is destroyed so it cannot be reproduced, and personal information recorded/stored on paper is shredded or incinerated.

Article 8 (Measures to Ensure the Safety of Personal Information)

The Company takes the following measures to ensure the safety of personal information.
1. Administrative measures: establishment and implementation of an internal management plan, regular staff training, etc.
2. Technical measures: access rights management for the personal information processing system, installation of an access control system, encryption of unique identifying information, and installation of security programs.
3. Physical measures: access control to the server room, archive room, etc.

Article 9 (Installation/Operation and Refusal of Automatic Personal Information Collection Devices)

1. The Company uses "cookies" that store and frequently retrieve usage information to provide individually tailored services to users.
2. A cookie is a small piece of information sent by the server (http) used to run the website to the user's browser, stored on the user's PC or mobile device.
3. Data subjects can allow or block cookies through their web browser settings. However, refusing to store cookies may cause difficulty in using tailored services.
▶ Allowing/Blocking Cookies in a Web Browser
- Chrome: Settings > Privacy and security > Delete browsing data
- Edge: Settings > Cookies and site permissions > Manage and delete cookies and site data

Article 10 (Personal Information Protection Officer)

1. The Company designates a personal information protection officer as below to take overall responsibility for personal information processing and to handle data subjects' complaints and relief related to personal information processing.
▶ Personal Information Protection Officer
${contactLine}
2. Data subjects may direct any inquiries, complaints, or relief matters related to personal information protection arising from use of the Company's services to the personal information protection officer. The Company will answer and handle data subjects' inquiries without delay.

Article 11 (Request to Access Personal Information)

A data subject may request access to personal information under Article 35 of the Personal Information Protection Act at the contact below. The Company will endeavor to process access requests promptly.
▶ Receipt/Handling of Access Requests
${contactLine}

Article 12 (Remedies for Infringement of Rights)

Data subjects may inquire about relief and consultation regarding personal information infringement to the following agencies.
1. Personal Information Dispute Mediation Committee: 1833-6972 (www.kopico.go.kr)
2. Personal Information Infringement Report Center: 118 (privacy.kisa.or.kr)
3. Supreme Prosecutors' Office: 1301 (www.spo.go.kr)
4. National Police Agency: 182 (ecrm.police.go.kr/minwon/main)

Article 13 (Effective Date and Changes to the Privacy Policy)

This Privacy Policy applies from ${effectiveDate}.`;
}
