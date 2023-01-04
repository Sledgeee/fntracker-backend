import * as dayjs from 'dayjs'

export const otpTemplate = (
	appUrl,
	appName,
	link,
	text,
	resetPassword,
	problem,
	automaticMail,
	rights
) => `
	<div style='margin:0;padding:0;width:100%;background-color:#f2f4f6'>
		<table width='100%' cellpadding='0' cellspacing='0'>
			<tbody>
				<tr>
					<td style='width:100%;margin:0;padding:0;background-color:#f2f4f6' align='center'>
						<table width='100%' cellpadding='0' cellspacing='0'>
							<tbody>
							<tr>
								<td style='padding:25px 0;text-align:center'>
									<a style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;font-size:19px;font-weight:bold;color:#2f3133;text-decoration:none"
									 href='${appUrl}' target='_blank'>
										${appName}
									</a>
								</td>
							</tr>
							<tr>
								<td style='width:100%;margin:0;padding:0;border-top:1px solid #edeff2;border-bottom:1px solid #edeff2;background-color:#fff' width='100%'>
									<table style='width:auto;max-width:570px;margin:0 auto;padding:0' align='center' width='570' cellpadding='0' cellspacing='0'>
										<tbody>
											<tr>
												<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;padding:35px">
													<p style='margin-top:0;color:#74787e;font-size:16px;line-height:1.5em'>
														${text}
													</p>
													<table style='width:100%;margin:30px auto;padding:0;text-align:center' align='center' width='100%' cellpadding='0' cellspacing='0'>
														<tbody>
															<tr>
																<td align='center'>
																	<a href='${link}' style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;display:block;display:inline-block;width:200px;min-height:20px;padding:10px;background-color:#3869d4;border-radius:3px;color:#ffffff;font-size:15px;line-height:25px;text-align:center;text-decoration:none;background-color:#3869d4" target='_blank'>
																		${resetPassword}
																	</a>
																</td>
															</tr>
														</tbody>
													</table>
													<table style='margin-top:25px;padding-top:25px;border-top:1px solid #edeff2'>
														<tbody>
														<tr>
															<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif">
																<p style='margin-top:0;color:#74787e;font-size:12px;line-height:1.5em'>
																	${problem}
																</p>
																<p style='margin-top:0;color:#74787e;font-size:12px;line-height:1.5em'>
																	<a style='color:#3869d4' href='${link}' target='_blank'>
																		${link}
																	</a>
																</p>
															</td>
														</tr>
													</tbody>
												</table>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td>
								<table style='width:auto;max-width:570px;margin:0 auto;padding:0;text-align:center' align='center' width='570' cellpadding='0' cellspacing='0'>
									<tbody>
										<tr>
											<td style="font-family:Arial,'Helvetica Neue',Helvetica,sans-serif;color:#aeaeae;padding:35px;text-align:center">
												<p style='margin-top:0;color:#74787e;font-size:12px;line-height:1.5em'>
													<strong>${automaticMail}</strong>
													<br>© ${dayjs().year()}
													<a style='color:#3869d4' href='${appUrl}' target='_blank'>${appName}</a>. ${rights}
												</p>
											</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
			</td>
			</tr>
		</tbody>
	</table>
	</div>
	`
