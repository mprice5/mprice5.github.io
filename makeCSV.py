import pandas as pd
import csv

file_nodes = "reheyhey/data.xlsx"
xl = pd.ExcelFile(file_nodes)

nodes = xl.parse('Node master')
final_nodes = nodes[['Label','value']]
final_nodes.columns = ['name','value']
final_nodes.to_csv('nodes.csv', sep=',', index = False)


replace_values = {  
					0:'Node',
					1:'PostgreSQL',
					2:'MySQL',
					3:'MariaDB',
					4:'MongoDB',
					5:'Redis',
					6:'ElasticSearch',
					7:'SQLite',
					8:'CouchDB',
					9:'Cassandra',
					10:'JSON file',
					11:'React',
					12:'Angular',
					13:'Angular 2',
					14:'Vue',
					15:'jQuery',
					16:'Meteor',
					17:'Ember',
					18:'Express',
					19:'Hapi',
					20:'GraphQL',
					21:'Koa',
					22:'Restify',
					23:'RabbitMQ',
					24:'ZeroMQ',
					25:'ActiveMQ',
					26:'NSQ',
					27:'Docker',
					28:'Triton',
					29:'Kubernetes',
					30:'AWS Lambda',
					31:'IBM Whisk',
					32:'Apache Whisk',
					33:'Azure Functions',
					34:'Google Cloud Functions',
					35:'Circle',
					36:'Travis',
					37:'Codeship',
					38:'Shippable',
					39:'Jenkins',
					40:'HAProxy',
					41:'Nginx',
					42:'Apache HTTP',
					43:'Apache Traffic Server',
					44:'pm2'
}

links = xl.parse('Link File')

final_linksBE = links[['Source','Target','BE Dev Weight']]
final_linksBE.columns = ['source','target','weight']
final_linksBE = final_linksBE.replace({"source":replace_values})
final_linksBE = final_linksBE.replace({"target":replace_values})
final_linksBE.to_csv('linksBE.csv', sep=',', index = False)

final_linksFE = links[['Source','Target','FE Dev Weight']]
final_linksFE.columns = ['source','target','weight']
final_linksFE = final_linksFE.replace({"source":replace_values})
final_linksFE = final_linksFE.replace({"target":replace_values})
final_linksFE.to_csv('linksFE.csv', sep=',', index = False)

final_linksFS = links[['Source','Target','FS Dev Weight']]
final_linksFS.columns = ['source','target','weight']
final_linksFS = final_linksFS.replace({"source":replace_values})
final_linksFS = final_linksFS.replace({"target":replace_values})
final_linksFS.to_csv('linksFS.csv', sep=',', index = False)