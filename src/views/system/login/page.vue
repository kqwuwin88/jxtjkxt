<template>
    <div class="page-login--layer" flex="dir:top main:center cross:center">
        <!-- logo -->
        <div class="page-login--logo">
            <img src="@/assets/imgs/logo_bg.png" />
        </div>
        <!-- form -->
        <div class="page-login-sub">
            <div>
                <div class="login-title">欢迎登录</div>
                <div class="page-login--form">
                    <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin" size="default">
                        <el-form-item prop="userName">
                            <el-input type="text" v-model.trim="formLogin.userName" maxlength="18" placeholder="用户名"></el-input>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input type="passWord" v-model.trim="formLogin.password" maxlength="20" placeholder="密码" show-password></el-input>
                        </el-form-item>
                        <el-form-item label="" prop="validCode">
                            <el-input v-model.trim="formLogin.validCode" maxlength="4" placeholder="验证码" class="input-solt">
                                <img :src="identifyCode" slot="append" @click="getSmsValid" style="height:48px;width:120px;display:block">
                            </el-input>
                        </el-form-item>
                        <div flex="main:justify cross:center" style="text-align:left">
                            <div flex-box="1">
                                <el-checkbox v-model="checkedSaft"></el-checkbox><el-button size="small" type="text" class="lo-vd-bt vsd-ml-10" @click="saftDialogVisible = true">已阅读用户隐私协议</el-button>
                            </div>
                        </div>
                        <el-button size="default" @click="submit"  @keyup.enter="enterSearch" type="primary" class="button-login" style="margin-top:20px">登录</el-button>
                    </el-form>
            </div>
            </div>
        </div>
        <div class="posibot-ba">
            <div>
                <p>版权所有 ©中国移动通信集团贵州有限公司&nbsp;&nbsp;本网站支持IPv6访问和IPv4网络访问，您正在使用{{pageInfo.ipType}}访问，您当前的IP地址是{{pageInfo.ip}}</p>
                <p>温馨提醒广大用户自觉远离网络有害信息，不上传、不分享、不下载淫秽色情信息。如有发现不良信息可通过如下方式举报：电话号码10086、短信平台号码10086999、电子邮箱10086666@chinamobile.com、<a href="https://www.12377.cn/" target="_blank"><b>中央网信办-违法和不良信息举报中心。</b></a></p>
            </div>
        </div>
        <el-dialog title="集信通消息监控先审后发平台用户隐私保密协议" :visible.sync="saftDialogVisible" append-to-body width="1000px" class="custom-dialog">
            <div style="line-height:21px;text-align:justify;height:500px;overflow:auto;padding-right:10px;">
                <p>更新日期：2023年06月20日</p>
                <p>生效日期：2023年06月20日</p>

                <p style="text-indent:2em" class="param_texts">
                    <br>中国移动通信集团贵州有限公司(以下称为“本公司”或“我们”)非常重视您的个人信息和他人的个人信息保护，并会尽全力保护您的个人信息和他人的个人信息。本《隐私政策》（“协议”）适用于本公司向您提供的集信通消息监控先审后发平台服务（以下简称“服务”），请您在使用服务前，仔细阅读并了解本协议条款。同时，我们以下划线方式提示您我们所收集、处理的个人敏感信息类型。但是本协议可能无法涉及所有场景，我们将会在收集前通过更新/补充协议或通知形式，告知您特定服务或功能将会收集您的个人数据，您可以选择同意或拒绝。同时，您在集信通消息监控先审后发平台上所直接或间接接触到的敏感信息，您有保密的责任和义务，不得向其他任何第三方泄露。
                    <br>当您开启集信通消息监控先审后发平台web端服务应用且完成登录程序后，即表示您已阅读、充分理解并同意接受本协议的全部内容，本协议即对您产生法律约束力。如您不同意部分或全部本协议内容，请您停止使用本服务。
                    <br>本协议包含以下内容：
                    <br>一、服务声明
                    <br>二、我们的服务版本功能声明
                    <br>三、我们如何收集和使用您的个人信息
                    <br>四、我们如何使用 Cookie 和同类技术
                    <br>五、我们如何共享、转让、公开披露您的个人信息
                    <br>六、我们如何保存及保护您的个人信息
                    <br>七、您的权利和义务
                    <br>八、我们如何处理未成年人的个人信息
                    <br>九、您的个人信息如何在全球范围转移
                    <br>十、本协议如何更新
                    <br>十一、如何联系我们
                    <br><b>一、服务声明</b>
                    <br>（一）您在访问集信通消息监控先审后发平台，登录“集信通消息监控先审后发平台web端”时，一旦选择“已阅读用户隐私协议”按钮，即表示为您已自愿接受协议中所有的条款和内容。
                    <br>（二）协议条款的效力范围仅限于本平台，您在平台的行为均受协议的约束。
                    <br>（三）本平台有权在未提前通知您的情况下修改本协议的条款。
                    <br>（四）本平台有权在未提前通知您的情况下修改、暂停平台部分或全部的服务，且不承担由此产生来自“您”和第三方的任何责任；如有必要，我们会以系统公告等形式在本平台上发布，我们提请您定期查阅了解有关变更、终止等信息。
                    <br>（五）本平台提供相关功能服务，您选择使用均是自愿行为，并享有平台更加完善的服务。
                    <br>（六）您使用本平台时，不得制作、复制、发布、传播危害国家安全、泄露国家机密等违法犯罪活动，发生前述行为，平台有权终止为您提供服务，您不仅要承担因您个人行为带来的法律责任法律问题，还应赔偿由此给平台造成的损失。
                    <br><b>二、我们的服务版本功能声明</b>
                    <br>我们向您提供的“集信通消息监控先审后发平台web端”功能包括“短信审核”、“监控配置”、“数据配置”、“用户管理”、“统计报表”、“运营分析”、“系统管理”等。其中，“短信审核”包括待审核短信、“审核日志查询”。“监控配置”包括端口管理、签名管理、短信模板管理、长消息流控端口；“数据配置”包括告警用户、黑名单用户、白名单用户、关键字、关键字策略组、异体字、分隔符、客户管理、端口归属管理；“用户管理”包括用户信息、用户组、部门管理；“统计报表”包括短信流量统计、按客户统计短信发送量、按端口统计短信发送量、按签名统计短信发送量、按省份统计短信发送量、按代理商统计短信发送量、按行业统计短信发送量；“运营分析”包括按客户统计短信发送量、按省份统计短信发送量、按行业统计短信发送量、按代理商统计短信发送量；“系统管理”包括系统配置、网关配置、操作日志。
                    <br><b>三、我们如何收集和使用您的个人信息</b>
                    <br>个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。
                    <br>本公司仅会出于本协议所述的以下目的，收集和使用您的个人信息：
                    <br>（一）为更好地为您提供服务，本公司将遵循“合法、正当、必要”原则，按照法律法规的规定和您的同意收集您的个人信息，主要业务功能包括：
                    <br>1． web端登录
                    <br>为了验证账号身份合法性，我们会收集您登录访问集信通消息监控先审后发平台web端所有使用的用户鉴权及登录信息，包括：账号、网络IP，获取用户登录所在城市。
                    <br>2．web端日志收集
                    <br>日志信息是指您使用我们的服务时，系统会记录您的操作日志信息，包括：登录账号、登录IP地址、操作日志详情、日志类别，这类信息是为您提供服务必须收集的基础信息。
                    <br>3．web端日志信息查询
                    <br>（1）您使用“审核日志查询”功能查询发送明细时，系统会记录您查询短信发送的日志信息，包括端口、客户名称、手机号码、归属地、短信内容、发送时间、配置信息、处理策略、审核人、审核时间、处理结果。这些信息是为您提供服务的目的，也是您使用集信通消息监控先审后发平台web端服务所接触到的敏感信息。
                    <br>（2）您使用“短信审核”、“监控配置”、“数据配置”、“用户管理”、“统计报表”、“运营分析”和“系统管理”功能进行查询、添加、修改、删除相关的操作行为，系统将会保存您的操作日志记录信息，包括登录账号、日志类型、操作时间、操作详情、登录IP。
                    <br>（二）集信通消息监控先审后发平台web端功能使用电脑设备权限说明
                    <br>1．登录：您登录集信通消息监控先审后发平台web端后，要获电脑端网络IP及网络IP所属城市。
                    <br>2．本地目录访问权限：当您使用集信通消息监控先审后发平台web端涉及文件上传、下载保存时（如：短信审核明细、关键字维护、黑白名单用户维护涉及手机号码导入、文件上传、短彩信发送明细下载等），集信通消息监控先审后发平台web端需要访问您电脑端本地目录。 
                    <br>3．查看网络状态：用于提示用户当前的网络状况情况，改善用户体验。
                    <br>4．网络权限：用于通过网络访问互联网页面及网络通信。
                    <br><b>四、我们如何使用 Cookie 和同类技术</b>
                    <br>（一）Cookie
                    <br>为确保服务能够正常运转，我们会在您的计算机或移动设备上存储名为 Cookie 的小数据文件。Cookie 通常包含标识符、站点名称以及一些号码和字符。
                    <br>我们不会将 Cookie 用于本协议所述目的之外的任何用途。您可根据自己的偏好管理或删除 Cookie。
                    <br>您可以清除计算机上保存的所有 Cookie，大部分网络浏览器都设有阻止 Cookie 的功能。但如果您这么做，则需要在每一次访问我们产品时亲自更改用户设置。
                    <br>（二）Do Not Track（请勿追踪）
                    <br>很多网络浏览器均设有 Do Not Track 功能，该功能可向网站发布 Do Not Track 请求。目前，主要互联网标准组织尚未设立相关协议来规定网站应如何应对此类请求。但如果您的浏览器启用了 Do Not Track，那么我们的所有网站都会尊重您的选择。
                    <br><b>五、我们如何共享、转让、公开披露您的个人信息</b>
                    <br>（一）共享
                    <br>我们不会与本产品服务提供者以外的公司、组织和个人共享您的个人信息，但以下情况除外：
                    <br>1．在获取明确同意的情况下共享：获得您的明确同意后，我们会与其他方共享您的个人信息。
                    <br>2．在法定情形下的共享：我们可能会根据法律法规规定、诉讼争议解决需要，或按行政、司法机关依法提出的要求，对外共享您的个人信息。
                    <br>3．与关联公司间共享：为了与我们的其他产品或服务所关联，为您提供更好的服务，或保护中国移动关联公司或其他用户或公众的人身财产安全免遭侵害，您的信息可能会在中国移动关联公司内共享。我们仅会出于特定、明确而合法的且在本政策所声明的目的范围内，在中国移动关联公司之间共享您的个人信息，并且只会共享提供服务所必要的信息。对于与关联公司共享的信息，我们会要求关联公司对您的信息采取不低于本政策声明的保护措施，并且严格遵守相关法律法规与监管要求。关联公司如要改变个人信息的处理目的，将需要再次征求您的授权同意。
                    <br>（二）转让
                    <br>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：
                    <br>1．在获取明确同意的情况下转让：获得您的明确同意后，我们会向其他方转让您的个人信息；
                    <br>2．在涉及合并、收购或破产清算时，如涉及到个人信息转让，我们会要求新的持有您个人信息的公司、组织继续受此个人信息保护协议的约束，否则我们将要求该公司、组织重新向您征求授权同意。
                    <br>（三）公开披露
                    <br>我们仅会在以下情况下，公开披露您的个人信息：
                    <br>1．获得您明确同意后；
                    <br>2．基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下，我们可能会公开披露您的个人信息。
                    <br>（四）您充分知晓，以下情形中我们使用个人信息无需征得您的授权同意：
                    <br>1．与国家安全、国防安全直接相关的；
                    <br>2．与公共安全、公共卫生、重大公共利益直接相关的；
                    <br>3．与犯罪侦查、起诉、审判和判决执行等直接相关的；
                    <br>4．出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
                    <br>5．所收集的个人信息是个人信息主体自行向社会公众公开的；
                    <br>6．从合法公开披露的信息中收集的您的个人信息的，如合法的新闻报道、政府信息公开等渠道；
                    <br>7．根据您的要求签订合同所必需的；
                    <br>8．用于维护所提供的产品与/或服务的安全稳定运行所必需的，例如发现、处置产品与/或服务的故障；
                    <br>9．为合法的新闻报道所必需的；
                    <br>10．学术研究机构基于公共利益开展统计或学术研究所必要，且对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
                    <br>11．法律法规规定的其他情形。
                    <br><b>六、我们如何保存及保护您的个人信息</b>
                    <br>（一）保存期限
                    <br>我们只会在达成本协议所述目的所需的期限内保留您的个人信息，除非经过您的同意延长保留期或受到法律的允许。如果您注销账号或主动删除上述信息，我们将按照法律、法规规定的最短期限保留您的现有个人信息，在法律法规要求的最短保存期限内，我们将不再对您的个人信息进行商业化使用。当您的个人信息超出上述保存期限，我们将会对其进行匿名化处理。
                    <br>（二）存放地域
                    <br>您的个人信息均储存于中华人民共和国境内；
                    <br>（三）安全保护措施
                    <br>1．我们会以“最小化”原则收集、使用、存储和传输用户信息，并通过用户协议和隐私协议告知您相关信息的使用目的和范围。我们会严格按照《网络安全法》《全国人民代表大会常务委员会关于加强网络信息保护的决定》《电信和互联网用户个人信息保护规定》（工业和信息化部令第24号）《电话用户真实身份信息登记规定》（工业和信息化部令第25号）等法律法规的相关要求，建立信息安全保障制度，采取技术措施和其他必要措施保护您的个人信息安全。
                    <br>2．本公司将运用各种安全技术和程序建立完善的管理制度来保护您的个人信息，以免遭受未经授权的访问、使用或披露。
                    <br>（一）数据加密：用户信息、日志信息和网络传输敏感参数数据采用RSA、AES、MD5加密技术确保数据的保密性和安全性；
                    <br>（二）访问控制：对相关访问进行授权，只有通过授权的访问才能正常使用；
                    <br>（三）恶意代码防范：源代码采取加固混淆处理，防止数据遭到恶意攻击； 
                    <br>（四）安全审计：定期组织开展数据安全专项检查等安全防护与检测措施，并对员工进行数据安全的意识培养和安全能力的培训，加强员工对于保护个人信息重要性的认识。
                    <br>尽管我们保护您的个人数据，但您有责任妥善保管您的个人数据，包括但不限账户、密码等。如果发现您的账号或密码被他人非法使用或有使用异常的情况，应及时联系我们。
                    <br>3．请您理解：互联网环境并非百分之百安全，我们将尽力确保或担保您发送给我们的任何信息的安全性，但由于技术的限制及可能存在的各种恶意手段，即便竭尽所能加强安全措施，也不可能始终保证信息百分之百安全。
                    <br>4．在不幸发生个人信息安全事件后，我们将按照法律法规的要求，及时向您告知：安全事件的基本情况和可能的影响、我们已采取或将要采取的处置措施、您可自主防范和降低风险的建议、对您的补救措施等。我们将及时将事件相关情况以邮件、信函、电话、推送通知等方式告知您，难以逐一告知个人信息主体时，我们会采取合理、有效的方式发布公告。同时，我们还将按照监管部门要求，主动上报个人信息安全事件的处置情况。
                    <br><b>七、您的权利和义务</b>
                    <br>（一）查询和更正您的个人信息
                    <br>1．您可以随时使用个人账户登录集信通消息监控先审后发平台web端，在“短信审核”中审核短信内容、查看短信审核日志；在“监控配置”中查看端口、签名、短信模板信息，包括查询、添加、修改、删除；在“数据配置”中查看黑名单用户或白名单用户信息（包括查询、添加、修改、删除）、告警用户信息（包括查询、添加、修改、删除）、查看关键字信息（包括查询、添加、修改、删除）、查看关键字策略组信息（包括查询、添加、修改、删除）、查看客户信息（包括查询、添加、修改、删除）、查看端口归属地信息（包括查询、添加、修改、删除）、查看异体字信息（包括查询、添加、修改、删除）、查看分隔符信息（包括查询、添加、修改、删除）；在“用户管理”中查看用户信息（包括查询、添加、修改、删除）、查看部门信息（包括查询、添加、修改、删除）、查看用户组信息（包括查询、添加、修改、删除）；在“统计报表”中查看短信流量统计、按客户统计短信发送量、按端口统计短信发送量、按签名统计短信发送量、按省份统计短信发送量、按代理商统计短信发送量、按行业统计短信发送量；“运营分析”中查看按客户统计短信发送量、按省份统计短信发送量、按行业统计短信发送量、按代理商统计短信发送量；在“系统管理”中查看系统配置信息（包括查询、添加、修改、删除）、查看网关信息（包括查询、添加、修改、删除）、操作日志。
                    <br>2．在您通过用户身份验证，且更正不影响信息的客观性和准确性的情况下，您有权对错误或不完整的信息做出更正或更新。您可以自行进行更正，或通过意见反馈或联系客服等将更正申请提交给我们。
                    <br>（二）删除个人信息
                    <br>1．如果我们处理个人信息的行为违反法律法规；
                    <br>2．如果我们收集、使用您的个人信息，却未征得您的同意；
                    <br>3．如果我们处理个人信息的行为违反了与您的约定；
                    <br>4．如果您不再使用我们的产品或服务，或您注销了账号；
                    <br>5．如果我们不再为您提供产品或服务。
                    <br>当您从我们的服务中删除信息后，我们可能不会立即从备份系统中删除相应的信息，但会在备份更新时删除这些信息。
                    <br>（三）注销账号
                    <br>如您希望注销账号，您可以联系集信通消息监控先审后发平台售后服务支撑负责人（姓名：吴坤全，电话：15186997171）申请注销账户。您注销账号之后，我们将停止为您提供产品或服务，并依据您的要求，在15个工作日内完成删除您的个人信息，法律法规另有规定的除外。
                    <br>（四）您使用我们的服务时，您有义务提供真实、合法性的信息，不限于姓名、电话号码等，信息如有变更，应及时更新。
                    <br>（五）您应妥善保管账号，您获得由本公司提供的账号及密码后进行的一切活动均视为是您本人的行为和意愿，您要负全部责任。
                    <br>（六）您在使用我们提供的服务时，同意且接受我们向您提供的各类信息服务。
                    <br>（七）您在使用我们提供的服务时，您已直接或间接接触到敏感信息，您有保密的责任和义务，不得向其他任何第三方泄露。
                    <br><b>八、我们如何处理未成年人的个人信息</b>
                    <br>（一）我们非常重视对未成年人个人信息的保护。若您是14周岁以下的未成年人，在使用我们的服务前，建议您请您的监护人仔细阅读本隐私协议，并事先取得您家长或法定监护人的同意。
                    <br>（二）对于经父母或法定监护人同意而收集未成年人个人信息的情况，我们只会在受到法律允许、父母或监护人明确同意或者保护未成年人所必要的情况下使用或公开披露此信息。
                    <br>（三）如果我们发现自己在未事先获得可证实的父母或法定监护人同意的情况下收集了未成年人的个人信息，则会设法尽快删除相关数据。
                    <br>（四）为更好的保护未成年人个人信息，我们会指定专人负责相关保护事宜，如有问题可按本隐私协议第九条所附联系方式与我们联系。
                    <br><b>九、您的个人信息如何在全球范围转移</b>
                    <br>原则上，我们在中华人民共和国境内收集和产生的个人信息，将存储在中华人民共和国境内。
                    <br><b>十、本协议如何更新</b>
                    <br>（一）我们的个人信息保护协议可能变更。原则上，我们不会削减您按照本个人信息保护协议所应享有的权利。
                    <br>（二）我们会通过集信通消息监控先审后发平台web端首页通告/公告的形式发布对本协议所做的任何变更。请您仔细阅读变更后的隐私保护指引内容，在该种情况下，若您继续使用我们的服务，即表示您同意接受修订后的隐私协议约束。
                    <br><b>十一、如何联系我们</b>
                    <br>如果您对本个人信息保护协议有任何疑问、意见或建议，可以随时通过拨打以下客服电话、登录集信通消息监控先审后发平台web端等方式与我们联系，我们会积极进行查证、处理并尽快答复。一般情况下，我们将在15天内回复
                    <br>公司名称：中国移动通信集团贵州有限公司
                    <br>通信地址：贵州省贵阳市观山湖区金诚街1号
                    <br>个人信息保护相关负责人联系方式：zhangjinxiang@gz.chinamobile.com
                    <br>联系电话：15186997171（产品支撑）/0851-82205039（技术支撑）
                    <br>温馨提醒广大用户自觉远离网络有害信息，不上传、不分享、不下载淫秽色情信息。如有发现不良信息可通过如下方式举报：电话号码10086、短信平台号码10086999、电子邮箱10086666@chinamobile.com、中央网信办-违法和不良信息举报中心。
                    <br>感谢您了解我们的用户隐私协议！

                </p>

            </div>
        </el-dialog>
    </div>
</template>

<script>
import CryptoJS from 'crypto-js'
import { mapActions } from "vuex";
export default {
    data() {
        return {
            saftDialogVisible:false,
            timeText:'发送',
            checkedSaft:false,
            timeFlag:false,
            // 表单
            formLogin: {
                //zhangjinxiang	Zjx@#2022@
                //liaoyuanxiu	LyX@123456789#
                userName: "",
                password: "",
                validCode:'',
            },
            identifyCode:'',
            // 表单校验
            rules: {
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur",},
                ],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur"},
                ],
                validCode: [
	            	{ required: true, message: '验证码不能为空', trigger: 'blur' },
	          	]
            },
            pageInfo:{
                info:'',
                ip:'',
                ipType:'',
            },
        };
    },
    
    async created() {
        await this.queryInfo();
        await this.getSmsValid();
        this.enterSearch(); //回车登录事件
    },
    methods: {
        ...mapActions("allstore/account", ["login"]),
        queryInfo(){
            return this.$api.getLoginInfo().then(res=>{
                this.pageInfo = res
            }).catch(res=>{})
        },
        Encrypt(code){
            var key = CryptoJS.enc.Utf8.parse(this.pageInfo.info); 
            var iv  = CryptoJS.enc.Utf8.parse(this.pageInfo.info);
            var srcs = CryptoJS.enc.Utf8.parse(code);  
            var encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv,mode:CryptoJS.mode.CBC,padding:CryptoJS.pad.ZeroPadding});
            return encrypted.toString();
        },
        Decrypt(word) {
            var key = CryptoJS.enc.Utf8.parse(this.pageInfo.info); 
            var iv  = CryptoJS.enc.Utf8.parse(this.pageInfo.info);
            let decrypt = CryptoJS.AES.decrypt(word, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
            return CryptoJS.enc.Utf8.stringify(decrypt).toString();
        },
        getSmsValid(){
            this.identifyCode = process.env.VUE_APP_APR+'getImageValid?'+Date.now();
        },
        submit() {
            if(!this.formLogin.userName){
                return this.$message.warning('请输入用户名')
            }
            if(!this.formLogin.password){
                return this.$message.warning('请输入密码')
            }
            if(!this.formLogin.validCode){
                return this.$message.warning('请输入验证码')
            }
            if(!this.checkedSaft){
                return this.$message.warning('请阅读隐私协议')
            }
            this.$refs.loginForm.validate((valid) => {
                if (valid) {
                    // 登录
                    // 注意 这里的演示没有传验证码
                    // 具体需要传递的数据请自行修改代码
                    this.login({
                        userName: this.Encrypt(this.formLogin.userName),
                        password: this.Encrypt(this.formLogin.password),
                        validCode: this.Encrypt(this.formLogin.validCode),
                    }).then(res => {
                        if(res.code===0){
                            this.$router.replace("/home");
                            if(res.notice && res.notice !==''){
                                this.$message.warning(res.notice)
                            }
                        }else{
                            this.queryInfo();
                            this.$message.error(res.msg)
                        }
                    }).catch(err=>{
                        this.getSmsValid()
                        this.queryInfo();
                    });
                } else {
                    // 登录表单校验失败
                    return false;
                }
            });
        },
        //回车登录事件
        enterSearch() {
            /*document.onkeydown = e => {
                console.log(e);
                //13表示回车键
                if (e.keyCode === 13 && e.target.baseURI.match(/login/)) {
                    //回车后执行登录方法
                    this.submit()
                }
            }*/
            document.addEventListener('keydown', (event) => {
                if (event.key === "Enter") {
                    console.log("You have just pressed Enter");
                    this.submit();
                }
               
            }, false);   
        },
    },
};
</script>

<style lang="scss">
.page-login--layer{
    @extend %unable-select;
    $backgroundColor: #fff;
    background-color: $backgroundColor;
    background: url(../../../assets/imgs/login_bg.png);
    background-position:center center;
    background-size: cover;
    background-repeat: no-repeat;
    height: 100%;
    .page-login--logo{
        position: absolute;
        left: 0;
        top: 0;
        height: 100px;
        width: 100%;
        overflow: hidden;
        z-index: 5;
        background: #fff;
    }
    .page-login--form{
        width: 368px;
        .el-input__inner{
            line-height: 50px;
            height: 50px;
            background: rgba(17, 113, 180,0.8);
            border: 1px solid #6eeffc;
            color: #fff;
            
        }
        ::-webkit-input-placeholder{
            color: #a4d6ef;
        }
    }
    .page-login-sub{
        width: 530px;
        background: #fff;
        box-sizing: border-box;
        text-align: center;
        position: absolute;
        border-radius: 20px;
        height: 100%;
        right: 100px;
        background: url(../../../assets/imgs/login_box.png);
        background-position: center center;
        display: flex;
        align-items: center;
        background-repeat: no-repeat;
        justify-content: center;
    }
    .button-login{
        width: 100%;
        margin-top: 40px;
        color: #fff;
        font-size: 22px;
        padding-top: 14px;
        padding-bottom: 14px;
        margin-bottom: 10px;
        background: #198fd9;
        border-color:#198fd9;
    }
    .login-tip{
        color: #999;
        font-size: 16px;
        margin-bottom: 30px;
    }
    .login-title{
        color: #fff;
        font-size: 36px;
        margin-bottom: 50px;
    }
    .page-login--options{
        color: #0070C0;
        cursor: pointer;
    }
    .input-solt{
        .el-input-group__append{
            padding: 0;
            canvas{
                vertical-align: top;
            }
        }
    }
}
.param_texts{
    b{
        font-size: 16px;
        margin-top: 20px;
        margin-bottom: 10px;
        display: inline-block;
        text-indent: 0;
    }
}
.posibot-ba{
    height: 100px;
    padding-top: 0;
    display: flex !important;
    align-items: center;
    line-height: 24px;
    color: #2d2d2d;
}
</style>
